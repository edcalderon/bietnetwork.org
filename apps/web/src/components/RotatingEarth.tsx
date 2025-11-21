"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface RotatingEarthProps {
  width?: number;
  height?: number;
  className?: string;
  markers?: { lat: number; lng: number }[];
  biets?: Array<{
    tokenId: bigint;
    name: string;
    description: string;
    category: string;
    location: string;
    creator: string;
    metadataURI: string;
    tags: string[];
  }>;
}

export default function RotatingEarth({ width = 800, height = 600, className = "", markers = [], biets = [] }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredBiet, setHoveredBiet] = useState<{ biet: typeof biets[0]; x: number; y: number } | null>(null);
  const [clickedBiet, setClickedBiet] = useState<{ biet: typeof biets[0]; x: number; y: number } | null>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0.002, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const projectionRef = useRef<any>(null);
  const containerWidthRef = useRef(0);
  const containerHeightRef = useRef(0);

  // Contract address for explorer links
  const CONTRACT_ADDRESS = "0xe2b081865b87089ab6ec2f16444a5ebb66a46c03";

  // Country coordinates for focusing
  const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
    Colombia: { lat: 4.711, lng: -74.072 },
    Mexico: { lat: 19.4326, lng: -99.1332 },
    "United States": { lat: 39.8283, lng: -98.5795 },
    Brazil: { lat: -14.235, lng: -51.9253 },
    Argentina: { lat: -38.4161, lng: -63.6167 },
    Chile: { lat: -35.6751, lng: -71.543 },
    Peru: { lat: -9.19, lng: -75.0152 },
    Spain: { lat: 40.4637, lng: -3.7492 },
  };

  // Handle focus events from Biet list clicks
  useEffect(() => {
    const handleFocusBiet = (event: CustomEvent) => {
      const { location } = event.detail;
      const coords = COUNTRY_COORDS[location];
      if (coords) {
        // This will be captured by the closure in the main useEffect
        // We'll use a global reference to communicate with the animation
        (window as any).focusTarget = {
          lng: coords.lng,
          lat: coords.lat,
          timestamp: Date.now()
        };
      }
    };

    window.addEventListener('focusBiet', handleFocusBiet as EventListener);
    return () => window.removeEventListener('focusBiet', handleFocusBiet as EventListener);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Set up responsive dimensions
    const containerWidth = Math.min(width, window.innerWidth - 40);
    const containerHeight = Math.min(height, window.innerHeight - 100);
    const radius = Math.min(containerWidth, containerHeight) / 2.5;

    // Store dimensions for hover detection
    containerWidthRef.current = containerWidth;
    containerHeightRef.current = containerHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    // Create projection and path generator for Canvas
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    // Store projection for hover detection
    projectionRef.current = projection;

    const path = d3.geoPath().projection(projection).context(context as any);

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point;
      let inside = false;

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }

      return inside;
    };

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry;

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates;
        // Check if point is in outer ring
        if (!pointInPolygon(point, coordinates[0])) {
          return false;
        }
        // Check if point is in any hole (inner rings)
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) {
            return false; // Point is in a hole
          }
        }
        return true;
      } else if (geometry.type === "MultiPolygon") {
        // Check each polygon in the MultiPolygon
        for (const polygon of geometry.coordinates) {
          // Check if point is in outer ring
          if (pointInPolygon(point, polygon[0])) {
            // Check if point is in any hole
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) {
              return true;
            }
          }
        }
        return false;
      }

      return false;
    };

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;

      const stepSize = dotSpacing * 0.08;
      let pointsGenerated = 0;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat];
          if (pointInFeature(point, feature)) {
            dots.push(point);
            pointsGenerated++;
          }
        }
      }

      console.log(
        `[RotatingEarth] Generated ${pointsGenerated} points for land feature:`,
        feature.properties?.featurecla || "Land",
      );
      return dots;
    };

    interface DotData {
      lng: number;
      lat: number;
      visible: boolean;
    }

    const allDots: DotData[] = [];
    let landFeatures: any;

    const render = () => {
      // Clear canvas
      context.clearRect(0, 0, containerWidth, containerHeight);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;

      // Draw ocean (globe background)
      context.beginPath();
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI);
      context.fillStyle = "#000000";
      context.fill();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2 * scaleFactor;
      context.stroke();

      if (landFeatures) {
        // Draw graticule
        const graticule = d3.geoGraticule();
        context.beginPath();
        path(graticule() as any);
        context.strokeStyle = "#ffffff";
        context.lineWidth = 1 * scaleFactor;
        (context as any).globalAlpha = 0.25;
        context.stroke();
        (context as any).globalAlpha = 1;

        // Draw land outlines
        context.beginPath();
        landFeatures.features.forEach((feature: any) => {
          path(feature as any);
        });
        context.strokeStyle = "#ffffff";
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        // Draw halftone dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat]);
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= containerWidth &&
            projected[1] >= 0 &&
            projected[1] <= containerHeight
          ) {
            context.beginPath();
            context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI);
            context.fillStyle = "#999999";
            context.fill();
          }
        });

        // Draw Biet markers (highlighted points)
        markers.forEach((marker) => {
          const projected = projection([marker.lng, marker.lat]);
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= containerWidth &&
            projected[1] >= 0 &&
            projected[1] <= containerHeight
          ) {
            context.beginPath();
            context.arc(projected[0], projected[1], 3 * scaleFactor, 0, 2 * Math.PI);
            context.fillStyle = "#ef4444"; // red highlight
            context.strokeStyle = "#ffffff"; // white outline for contrast
            context.lineWidth = 1 * scaleFactor;
            context.fill();
            context.stroke();
          }
        });
      }
    };

    const loadWorldData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json",
        );
        if (!response.ok) throw new Error("Failed to load land data");

        landFeatures = await response.json();

        // Generate dots for all land features
        let totalDots = 0;
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16);
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat, visible: true });
            totalDots++;
          });
        });

        console.log(`[RotatingEarth] Total dots generated: ${totalDots} across ${landFeatures.features.length} land features`);

        render();
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load land map data");
        setIsLoading(false);
      }
    };

    // Set up rotation and interaction
    const rotation: [number, number] = [0, 0];
    let autoRotate = true;
    const rotationSpeed = 0.5;

    let focusTimeout: NodeJS.Timeout | null = null;

    const rotate = () => {
      // Check for focus target
      const focusTarget = (window as any).focusTarget;
      if (focusTarget && focusTarget.timestamp > Date.now() - 1000) {
        // Clear any existing focus timeout
        if (focusTimeout) clearTimeout(focusTimeout);
        
        // Pause auto-rotation
        autoRotate = false;
        isPausedRef.current = true;
        
        // Calculate target rotation to center the location
        const targetRotationX = -focusTarget.lng;
        const targetRotationY = focusTarget.lat;
        
        // Smooth transition to target
        const startRotationX = rotation[0];
        const startRotationY = rotation[1];
        const duration = 1000; // 1 second transition
        const startTime = Date.now();
        
        const animateFocus = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          
          rotation[0] = startRotationX + (targetRotationX - startRotationX) * easeProgress;
          rotation[1] = startRotationY + (targetRotationY - startRotationY) * easeProgress;
          rotation[1] = Math.max(-90, Math.min(90, rotation[1]));
          
          projection.rotate(rotation as any);
          render();
          
          if (progress < 1) {
            requestAnimationFrame(animateFocus);
          } else {
            // Resume auto-rotation after 5 seconds
            focusTimeout = setTimeout(() => {
              autoRotate = true;
              isPausedRef.current = false;
              focusTimeout = null;
            }, 5000);
          }
        };
        
        animateFocus();
        
        // Clear the focus target
        (window as any).focusTarget = null;
      } else if (autoRotate && !isPausedRef.current) {
        rotation[0] += rotationSpeed;
        projection.rotate(rotation as any);
        render();
      }
    };

    // Auto-rotation timer
    const rotationTimer = d3.timer(rotate);

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation: [number, number] = [...rotation];

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.5;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        rotation[0] = startRotation[0] + dx * sensitivity;
        rotation[1] = startRotation[1] - dy * sensitivity;
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]));

        projection.rotate(rotation as any);
        render();
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        setTimeout(() => {
          autoRotate = true;
        }, 10);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
      const newRadius = Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * scaleFactor));
      projection.scale(newRadius as any);
      render();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDraggingRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if hovering over any Biet marker
      let foundBiet = false;
      markers.forEach((marker, index) => {
        const projected = projection([marker.lng, marker.lat]);
        if (
          projected &&
          projected[0] >= 0 &&
          projected[0] <= containerWidth &&
          projected[1] >= 0 &&
          projected[1] <= containerHeight
        ) {
          const distance = Math.sqrt(
            Math.pow(x - projected[0], 2) + Math.pow(y - projected[1], 2)
          );
          
          // Check if within hover radius (10px)
          if (distance <= 10) {
            const biet = biets[index];
            if (biet) {
              setHoveredBiet({ biet, x: projected[0] + rect.left, y: projected[1] + rect.top });
              foundBiet = true;
            }
          }
        }
      });

      if (!foundBiet) {
        setHoveredBiet(null);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if clicking on any Biet marker
      markers.forEach((marker, index) => {
        const projected = projection([marker.lng, marker.lat]);
        if (
          projected &&
          projected[0] >= 0 &&
          projected[0] <= containerWidth &&
          projected[1] >= 0 &&
          projected[1] <= containerHeight
        ) {
          const distance = Math.sqrt(
            Math.pow(x - projected[0], 2) + Math.pow(y - projected[1], 2)
          );
          
          // Check if within click radius (10px)
          if (distance <= 10) {
            const biet = biets[index];
            if (biet) {
              // Focus on the clicked Biet using the existing focus mechanism
              const coords = COUNTRY_COORDS[biet.location];
              if (coords) {
                (window as any).focusTarget = {
                  lng: coords.lng,
                  lat: coords.lat,
                  timestamp: Date.now()
                };
              }
              setClickedBiet({ biet, x: projected[0] + rect.left, y: projected[1] + rect.top });
            }
          }
        }
      });
    };

    const handleMouseLeave = () => {
      setHoveredBiet(null);
    };

    const handleCanvasClick = (event: MouseEvent) => {
      // Check if clicking on empty space (not on a marker)
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      let clickedOnMarker = false;
      markers.forEach((marker) => {
        const projected = projection([marker.lng, marker.lat]);
        if (
          projected &&
          projected[0] >= 0 &&
          projected[0] <= containerWidth &&
          projected[1] >= 0 &&
          projected[1] <= containerHeight
        ) {
          const distance = Math.sqrt(
            Math.pow(x - projected[0], 2) + Math.pow(y - projected[1], 2)
          );
          
          if (distance <= 10) {
            clickedOnMarker = true;
          }
        }
      });

      // If clicking on empty space, clear the clicked Biet
      if (!clickedOnMarker) {
        setClickedBiet(null);
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("wheel", handleWheel, { passive: false } as any);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("click", handleCanvasClick);

    // Load the world data
    loadWorldData();

    // Cleanup
    return () => {
      rotationTimer.stop();
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("click", handleCanvasClick);
      if (focusTimeout) clearTimeout(focusTimeout);
    };
  }, [width, height]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-card rounded-2xl p-8 ${className}`}>
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Error loading Earth visualization</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground z-10">
          Loading globe…
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-2xl bg-background"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground px-2 py-1 rounded-md bg-neutral-900/80">
        Drag to rotate • Scroll to zoom • Click red markers to focus & view details
      </div>
      
      {/* Tooltip - Show clicked Biet or hovered Biet */}
      {(clickedBiet || hoveredBiet) && (
        <div
          className={`absolute z-50 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-3 ${clickedBiet ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{
            left: `${(clickedBiet || hoveredBiet)!.x}px`,
            top: `${(clickedBiet || hoveredBiet)!.y}px`,
            transform: 'translate(-50%, -100%) translateY(-10px)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <h4 className="text-white font-semibold text-sm max-w-xs">
              {(clickedBiet || hoveredBiet)!.biet.name}
            </h4>
            {clickedBiet && (
              <button
                onClick={() => setClickedBiet(null)}
                className="ml-auto text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            )}
          </div>
          <div className="text-xs text-slate-400 mb-2">
            #{(clickedBiet || hoveredBiet)!.biet.tokenId.toString()} • {(clickedBiet || hoveredBiet)!.biet.category}
          </div>
          <div className="text-xs text-slate-500 mb-3">
            {(clickedBiet || hoveredBiet)!.biet.location}
          </div>
          <a
            href={`https://sepolia.basescan.org/token/${CONTRACT_ADDRESS}?a=${(clickedBiet || hoveredBiet)!.biet.tokenId.toString()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
            </svg>
            View on Explorer
          </a>
          {/* Tooltip arrow */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-700"></div>
          </div>
        </div>
      )}
    </div>
  );
}
