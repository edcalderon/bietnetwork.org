"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { CSSProperties } from "react";

// --- CONFIGURATION BLOCK for Easy Remixing ---
export const CONFIG = {
  // Visuals - Green colors matching the cards
  primaryColor: "16, 185, 129", // RGB for Emerald (Wireframe & Main Glow)
  secondaryColor: "34, 197, 94", // RGB for Green (Core Light)

  // Animation Speed (Higher value = slower animation)
  sphereRotationDuration: "240s", // Time for full sphere rotation
  gridPanDuration: "180s", // Time for full background grid pan
  coreGlowDuration: "25s", // Time for core light pulsation

  // Intensity & Depth
  wireframeOpacity: 0.75, // Opacity of the wireframe lines
  wireframeShadowIntensity: 70, // Glow size (in px) of the wireframe
  coreBlur: 200, // Blur radius (in px) of the core light
  parallaxDepth: 35, // Strength of the mouse-follow effect (Higher = more movement)
  lerpFactor: 0.08, // Smoothing factor for mouse movement (0.01 is slow, 0.2 is fast)
  sphereDensity: 12, // Number of layered rings in the sphere (Higher = denser mesh)
};

// Helper function for linear interpolation (Lerp)
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// Hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

/**
 * SimplifiedMobileSphere
 * 
 * Lightweight mobile version with minimal animations:
 * - Static sphere rings (no rotation)
 * - Reduced particle count
 * - No mouse tracking
 * - Minimal blur effects
 * - Optimized for 60fps scroll performance
 */
function SimplifiedMobileSphere() {
  // Static sphere rings - no animations for performance
  const mobileRings = Array.from({ length: 6 }, (_, i) => {
    const step = 90 / (6 / 2);
    const angle = i * step;
    const radius = 250;
    const depth = Math.sin((angle * Math.PI) / 180) * radius;
    
    const commonStyle: CSSProperties = {
      transform: `
        translateZ(${depth}px)
        ${i % 2 === 0 ? `rotateY(${angle}deg)` : `rotateX(${angle}deg)`}
      `,
      transformStyle: 'preserve-3d' as const,
      opacity: 0.3 + (Math.abs(depth) / radius) * 0.7,
      willChange: 'transform',
    };
    
    return (
      <div
        key={`mobile-ring-${i}`}
        className="wireframe-line"
        style={commonStyle}
        aria-hidden="true"
      />
    );
  });

  // Minimal particles - no animation
  const mobileParticles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 150 + Math.random() * 50;
    const height = (Math.random() - 0.5) * 200;
    const size = 1.5 + Math.random() * 2;
    
    return (
      <div
        key={`mobile-particle-${i}`}
        className="absolute rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: `rgba(${CONFIG.secondaryColor}, 0.3 + Math.random() * 0.2)`,
          transform: `translate3d(${Math.cos(angle) * radius}px, ${height}px, ${Math.sin(angle) * radius}px)`,
          boxShadow: `0 0 ${size}px rgba(${CONFIG.secondaryColor}, 0.4)`,
          willChange: 'transform',
        }}
      />
    );
  });

  // Simplified core glow - no animation
  const mobileCoreStyle: CSSProperties = {
    width: "300px",
    height: "300px",
    backgroundImage: `radial-gradient(circle, rgba(${CONFIG.secondaryColor}, 0.4) 0%, transparent 70%)`,
    filter: `blur(50px)`, // Minimal blur
    boxShadow: `0 0 50px rgba(${CONFIG.secondaryColor}, 0.2)`,
    willChange: 'transform',
  };

  const mobileGridStyle: CSSProperties = {
    backgroundImage:
      "repeating-linear-gradient(to right, rgba(10,10,10,0.9) 1px, transparent 1px), repeating-linear-gradient(to bottom, rgba(10,10,10,0.9) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: 0.08, // Very subtle
    willChange: 'transform',
  };

  return (
    <div className="geometric-sphere">
      {/* Static grid background */}
      <div className="absolute inset-0 panning-grid" style={mobileGridStyle} />
      
      {/* Simplified core glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" style={mobileCoreStyle} />
      
      {/* Static sphere rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sphere-container z-40 pointer-events-none">
        <div
          className="w-[500px] h-[500px]"
          style={{
            transform: "perspective(1000px)",
            transformStyle: 'preserve-3d',
            transformOrigin: "center center",
          }}
        >
          {mobileRings}
          {mobileParticles}
        </div>
      </div>

      {/* Minimal bloom */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${CONFIG.primaryColor}, 0.2) 0%, transparent 50%)`,
          mixBlendMode: "screen" as const,
          filter: "blur(30px)",
          opacity: 0.5,
          willChange: 'transform',
        }}
      />
    </div>
  );
}
/**
 * GeometricSphere
 *
 * Responsive background component with device-specific optimizations:
 * Desktop: Full animated sphere with mouse tracking and all effects
 * Mobile: Simplified static sphere for optimal scroll performance
 *
 * All visual tuning via CONFIG above for remixing.
 */
export default function GeometricSphere() {
  // ALL hooks must be called first - before any conditional logic
  const isMobile = useIsMobile();
  const [targetMousePos, setTargetMousePos] = useState({ x: 0, y: 0 });
  const currentMousePos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  // Desktop-only hooks - wrapped in condition but still called every render
  const animateLerp = useCallback(() => {
    currentMousePos.current.x = lerp(
      currentMousePos.current.x,
      targetMousePos.x,
      CONFIG.lerpFactor
    );
    currentMousePos.current.y = lerp(
      currentMousePos.current.y,
      targetMousePos.y,
      CONFIG.lerpFactor
    );
    animationFrameRef.current = requestAnimationFrame(animateLerp);
  }, [targetMousePos]);

  useEffect(() => {
    if (isMobile) return; // Early return in effect, but hook still called
    animationFrameRef.current = requestAnimationFrame(animateLerp);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateLerp, isMobile]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobile) return; // Early return in callback, but hook still called
    setTargetMousePos({
      x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
      y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
    });
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return; // Early return in effect, but hook still called
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, isMobile]);

  // Now we can safely do early return after all hooks are called
  if (isMobile) {
    return <SimplifiedMobileSphere />;
  }

  const { x: smoothX, y: smoothY } = currentMousePos.current;

  // Parallax & rotation math
  const parallaxDepth = CONFIG.parallaxDepth;
  const rotationStrength = 5;

  const baseTranslate = `translate3d(${smoothX * parallaxDepth}px, ${smoothY * parallaxDepth}px, 0)`;
  const gridTranslate = `translate3d(${-smoothX * (parallaxDepth / 2)}px, ${-smoothY * (parallaxDepth / 2)}px, 0)`;
  const hazeTranslate = `translate3d(${smoothX * (parallaxDepth / 2)}px, ${smoothY * (parallaxDepth / 2)}px, 0)`;

  const tiltRotateX = smoothY * rotationStrength;
  const tiltRotateY = -smoothX * rotationStrength;
  const tiltTranslate = `rotateX(${tiltRotateX}deg) rotateY(${tiltRotateY}deg)`;

  // Generate sphere rings with true 3D positioning - desktop version
  const sphereRings = Array.from({ length: CONFIG.sphereDensity }, (_, i) => {
    const step = 90 / (CONFIG.sphereDensity / 2);
    const angle = i * step;
    const radius = 350; // Radius of the sphere
    const depth = Math.sin((angle * Math.PI) / 180) * radius; // Calculate 3D depth
    
    const commonStyle: CSSProperties = {
      transform: `
        translateZ(${depth}px)
        ${i % 2 === 0 ? `rotateY(${angle}deg)` : `rotateX(${angle}deg)`}
        ${i % 3 === 0 ? `rotateZ(${angle / 2}deg)` : ''}
      `,
      transformStyle: 'preserve-3d' as const,
      opacity: 0.3 + (Math.abs(depth) / radius) * 0.7, // Depth-based opacity
      willChange: 'transform', // GPU acceleration
    };
    return (
      <div
        key={`ring-${i}`}
        className="wireframe-line"
        style={commonStyle}
        aria-hidden="true"
      />
    );
  });

  // Original desktop styles
  const coreLightStyle: CSSProperties = {
    width: "400px",
    height: "400px",
    backgroundImage: `radial-gradient(circle, rgba(${CONFIG.secondaryColor}, 0.45) 0%, transparent 70%)`,
    filter: `blur(${CONFIG.coreBlur}px)`,
    boxShadow: `0 0 ${CONFIG.coreBlur / 2}px 30px rgba(${CONFIG.secondaryColor}, 0.2), 0 0 ${CONFIG.coreBlur}px 50px rgba(${CONFIG.primaryColor}, 0.15)`,
    animation: `coreGlow ${CONFIG.coreGlowDuration} ease-in-out infinite`,
    willChange: 'transform',
  };

  const panningGridStyle: CSSProperties = {
    transform: gridTranslate,
    backgroundImage:
      "repeating-linear-gradient(to right, rgba(10,10,10,0.9) 1px, transparent 1px), repeating-linear-gradient(to bottom, rgba(10,10,10,0.9) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: 0.15,
    animation: `gridPan ${CONFIG.gridPanDuration} linear infinite`,
    willChange: 'transform',
  };

  const hazeStyle: CSSProperties = {
    transform: hazeTranslate,
    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${CONFIG.primaryColor}, 0.15) 0%, transparent 50%)`,
    filter: "blur(150px)",
    opacity: 0.6,
    mixBlendMode: "screen" as const,
    willChange: 'transform',
  };

  const deepBaseStyle: CSSProperties = {
    transform: baseTranslate,
    backgroundImage: `radial-gradient(at 50% 50%, rgba(${CONFIG.primaryColor}, 0.08) 0%, #030712 90%)`,
    willChange: 'transform',
  };

  const bloomStyle: CSSProperties = {
    transform: baseTranslate,
    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${CONFIG.primaryColor}, 0.35) 0%, transparent 50%), radial-gradient(circle at 10% 10%, rgba(${CONFIG.secondaryColor}, 0.25) 0%, transparent 30%)`,
    mixBlendMode: "screen" as const,
    filter: "blur(100px)",
    opacity: 0.95,
    willChange: 'transform',
  };

  // Generate 3D floating particles - desktop version
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const radius = 200 + Math.random() * 150;
    const height = (Math.random() - 0.5) * 300;
    const size = 2 + Math.random() * 4;
    
    return (
      <div
        key={`particle-${i}`}
        className="absolute rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: `rgba(${CONFIG.secondaryColor}, ${0.3 + Math.random() * 0.4})`,
          transform: `translate3d(${Math.cos(angle) * radius}px, ${height}px, ${Math.sin(angle) * radius}px)`,
          animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
          boxShadow: `0 0 ${size * 2}px rgba(${CONFIG.secondaryColor}, 0.5)`,
          willChange: 'transform',
        }}
      />
    );
  });

  return (
    <div className="geometric-sphere">
      {/* Layer 0: Panning Grid Layer (Farthest Back - ZIndex 0) */}
      <div className="absolute inset-0 panning-grid" style={panningGridStyle} />

      {/* Layer 1: Volumetric Haze (Medium - ZIndex 1) */}
      <div className="absolute inset-0" style={hazeStyle} />

      {/* Layer 2: Deep Base Background & Core Glow (ZIndex 2-3) */}
      <div className="absolute inset-0" style={deepBaseStyle}>
        <div className="core-light absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" style={coreLightStyle} />
      </div>

      {/* Layer 3: Geometric Glow Sphere (3D Animated Element) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sphere-container z-40 pointer-events-none">
        <div
          className="w-[700px] h-[700px] sphere-rotation"
          style={{
            transform: `${tiltTranslate} perspective(1000px)`,
            transformStyle: 'preserve-3d',
            transformOrigin: "center center",
            animationDuration: CONFIG.sphereRotationDuration,
          }}
        >
          {sphereRings}
          {/* 3D Particles */}
          {particles}
        </div>
      </div>

      {/* Layer 4: Soft Radial Bloom (Ambient Light Layer) */}
      <div className="absolute inset-0" style={bloomStyle} />

      {/* Layer 5: Noise Layer (For Film Grain Texture) */}
      <div
        className="absolute inset-0 pointer-events-none noise-layer"
        style={{
          backgroundImage:
            'url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")',
          backgroundSize: "200px",
          opacity: 0.05,
          mixBlendMode: "overlay" as const,
        } as CSSProperties}
      />

      {/* Final Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none vignette-overlay" />
    </div>
  );
}
