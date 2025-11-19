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
 * GeometricSphere
 *
 * Self-contained background component with layered effects:
 * - panning grid
 * - volumetric haze
 * - chromatic core glow
 * - animated wireframe sphere (multiple rings)
 * - soft bloom, noise, vignette
 *
 * All visual tuning via CONFIG above for remixing.
 */
export default function GeometricSphere() {
  const [targetMousePos, setTargetMousePos] = useState({ x: 0, y: 0 });
  const currentMousePos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const isMobile = useIsMobile();

  // Mobile performance optimizations without changing shape
  const mobileLerpFactor = isMobile ? 0.15 : CONFIG.lerpFactor; // Faster lerp on mobile
  const mobileParallaxDepth = isMobile ? 10 : CONFIG.parallaxDepth; // Reduced parallax on mobile

  const animateLerp = useCallback(() => {
    currentMousePos.current.x = lerp(
      currentMousePos.current.x,
      targetMousePos.x,
      mobileLerpFactor
    );
    currentMousePos.current.y = lerp(
      currentMousePos.current.y,
      targetMousePos.y,
      mobileLerpFactor
    );
    animationFrameRef.current = requestAnimationFrame(animateLerp);
  }, [targetMousePos, mobileLerpFactor]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animateLerp);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateLerp]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Throttle mouse updates on mobile for performance
    if (isMobile) {
      const now = Date.now();
      if (!handleMouseMove.lastUpdate || now - handleMouseMove.lastUpdate > 50) {
        handleMouseMove.lastUpdate = now;
        setTargetMousePos({
          x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
          y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
        });
      }
    } else {
      setTargetMousePos({
        x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
        y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
      });
    }
  }, [isMobile]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const { x: smoothX, y: smoothY } = currentMousePos.current;

  // Parallax & rotation math
  const parallaxDepth = mobileParallaxDepth;
  const rotationStrength = 5;

  const baseTranslate = `translate3d(${smoothX * parallaxDepth}px, ${smoothY * parallaxDepth}px, 0)`;
  const gridTranslate = `translate3d(${-smoothX * (parallaxDepth / 2)}px, ${-smoothY * (parallaxDepth / 2)}px, 0)`;
  const hazeTranslate = `translate3d(${smoothX * (parallaxDepth / 2)}px, ${smoothY * (parallaxDepth / 2)}px, 0)`;

  const tiltRotateX = smoothY * rotationStrength;
  const tiltRotateY = -smoothX * rotationStrength;
  const tiltTranslate = `rotateX(${tiltRotateX}deg) rotateY(${tiltRotateY}deg)`;

  // Generate sphere rings with true 3D positioning - shape preserved
  const sphereRings = Array.from({ length: CONFIG.sphereDensity }, (_, i) => {
    const step = 90 / (CONFIG.sphereDensity / 2);
    const angle = i * step;
    const radius = 350; // Radius of the sphere - keep original for shape
    const depth = Math.sin((angle * Math.PI) / 180) * radius; // Calculate 3D depth
    
    const commonStyle: CSSProperties = {
      transform: `
        translateZ(${depth}px)
        ${i % 2 === 0 ? `rotateY(${angle}deg)` : `rotateX(${angle}deg)`}
        ${i % 3 === 0 ? `rotateZ(${angle / 2}deg)` : ''}
      `,
      transformStyle: 'preserve-3d' as const,
      opacity: 0.3 + (Math.abs(depth) / radius) * 0.7, // Depth-based opacity
      willChange: 'transform', // GPU acceleration for mobile performance
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

  // Inline style values derived from CONFIG to be set on elements - mobile optimized
  const coreLightStyle: CSSProperties = {
    width: "400px",
    height: "400px",
    backgroundImage: `radial-gradient(circle, rgba(${CONFIG.secondaryColor}, 0.45) 0%, transparent 70%)`,
    filter: `blur(${isMobile ? CONFIG.coreBlur / 2 : CONFIG.coreBlur}px)`, // Reduced blur on mobile
    boxShadow: `0 0 ${isMobile ? CONFIG.coreBlur / 3 : CONFIG.coreBlur / 2}px 30px rgba(${CONFIG.secondaryColor}, 0.2), 0 0 ${isMobile ? CONFIG.coreBlur / 2 : CONFIG.coreBlur}px 50px rgba(${CONFIG.primaryColor}, 0.15)`, // Optimized for mobile
    animation: `coreGlow ${CONFIG.coreGlowDuration} ease-in-out infinite`,
    willChange: 'transform', // GPU acceleration
  };

  const panningGridStyle: CSSProperties = {
    transform: gridTranslate,
    backgroundImage:
      "repeating-linear-gradient(to right, rgba(10,10,10,0.9) 1px, transparent 1px), repeating-linear-gradient(to bottom, rgba(10,10,10,0.9) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: isMobile ? 0.1 : 0.15, // Slightly reduced on mobile
    animation: `gridPan ${CONFIG.gridPanDuration} linear infinite`,
    willChange: 'transform', // GPU acceleration
  };

  const hazeStyle: CSSProperties = {
    transform: hazeTranslate,
    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${CONFIG.primaryColor}, 0.15) 0%, transparent 50%)`,
    filter: `blur(${isMobile ? "75px" : "150px"})`, // Reduced blur on mobile
    opacity: isMobile ? 0.4 : 0.6, // Reduced opacity on mobile
    mixBlendMode: "screen" as const,
    willChange: 'transform', // GPU acceleration
  };

  const deepBaseStyle: CSSProperties = {
    transform: baseTranslate,
    backgroundImage: `radial-gradient(at 50% 50%, rgba(${CONFIG.primaryColor}, 0.08) 0%, #030712 90%)`,
    willChange: 'transform', // GPU acceleration
  };

  const bloomStyle: CSSProperties = {
    transform: baseTranslate,
    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${CONFIG.primaryColor}, 0.35) 0%, transparent 50%), radial-gradient(circle at 10% 10%, rgba(${CONFIG.secondaryColor}, 0.25) 0%, transparent 30%)`,
    mixBlendMode: "screen" as const,
    filter: `blur(${isMobile ? "50px" : "100px"})`, // Reduced blur on mobile
    opacity: isMobile ? 0.7 : 0.95, // Reduced opacity on mobile
    willChange: 'transform', // GPU acceleration
  };

  // Generate 3D floating particles - mobile optimized
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
          backgroundColor: `rgba(${CONFIG.secondaryColor}, ${isMobile ? 0.2 + Math.random() * 0.2 : 0.3 + Math.random() * 0.4})`, // Reduced opacity on mobile
          transform: `translate3d(${Math.cos(angle) * radius}px, ${height}px, ${Math.sin(angle) * radius}px)`,
          animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
          boxShadow: `0 0 ${size * 2}px rgba(${CONFIG.secondaryColor}, ${isMobile ? 0.3 : 0.5})`, // Reduced glow on mobile
          willChange: 'transform', // GPU acceleration
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
