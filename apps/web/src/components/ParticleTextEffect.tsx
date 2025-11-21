'use client';

import { useEffect, useRef } from 'react';

interface Vector2D {
  x: number;
  y: number;
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 };
  vel: Vector2D = { x: 0, y: 0 };
  acc: Vector2D = { x: 0, y: 0 };
  target: Vector2D = { x: 0, y: 0 };

  closeEnoughTarget = 100;
  maxSpeed = 1.0;
  maxForce = 0.1;
  particleSize = 10;
  isKilled = false;

  startColor = { r: 0, g: 0, b: 0 };
  targetColor = { r: 0, g: 0, b: 0 };
  colorWeight = 0;
  colorBlendRate = 0.01;

  move() {
    let proximityMult = 1;
    const distance = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y);

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.hypot(towardsTarget.x, towardsTarget.y);
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.hypot(steer.x, steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };

    ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;

    if (drawAsPoints) {
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
    } else {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2);
      this.target.x = randomPos.x;
      this.target.y = randomPos.y;

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;

      this.isKilled = true;
    }
  }

  private generateRandomPos(x: number, y: number, mag: number): Vector2D {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 500;

    const direction = {
      x: randomX - x,
      y: randomY - y,
    };

    const magnitude = Math.hypot(direction.x, direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  }
}

interface ParticleTextEffectProps {
  words?: string[];
}

const DEFAULT_WORDS = ['Biet Network'];

export function ParticleTextEffect({ words = DEFAULT_WORDS }: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef(0);
  const wordIndexRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false });
  const isVisibleRef = useRef(true);

  // Slightly larger step to reduce total particles and improve performance
  const pixelSteps = 10;
  const drawAsPoints = true;

  const generateRandomPos = (x: number, y: number, mag: number): Vector2D => {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 500;

    const direction = {
      x: randomX - x,
      y: randomY - y,
    };

    const magnitude = Math.hypot(direction.x, direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  };

  const nextWord = (word: string, canvas: HTMLCanvasElement) => {
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    if (!offscreenCtx) return;

    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.fillStyle = 'white';
    // Responsive font: scale with canvas height so it grows on large screens but avoids clipping
    const responsiveFontSize = Math.min(offscreenCanvas.height * 0.4, 120); // cap to avoid overflow
    offscreenCtx.font = `bold ${responsiveFontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    offscreenCtx.textAlign = 'center';
    offscreenCtx.textBaseline = 'middle';
    offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2);

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const isDark = document.documentElement.classList.contains('dark');
    const palette = isDark
      ? [
          { r: 45, g: 212, b: 191 }, // emerald-400
          { r: 56, g: 189, b: 248 }, // sky-400
          { r: 129, g: 140, b: 248 }, // indigo-400
        ]
      : [
          { r: 22, g: 163, b: 74 }, // emerald-600
          { r: 5, g: 150, b: 105 },  // emerald-600 alt
          { r: 37, g: 99, b: 235 },  // blue-600
        ];
    const newColor = palette[Math.floor(Math.random() * palette.length)];

    const particles = particlesRef.current;
    let particleIndex = 0;

    const coordsIndexes: number[] = [];
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i);
    }

    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
    }

    const dpr = window.devicePixelRatio || 1;

    for (const coordIndex of coordsIndexes) {
      const pixelIndex = coordIndex;
      const alpha = pixels[pixelIndex + 3];

      if (alpha > 0) {
        const xDevice = (pixelIndex / 4) % canvas.width;
        const yDevice = Math.floor(pixelIndex / 4 / canvas.width);

        const x = xDevice / dpr;
        const y = yDevice / dpr;

        let particle: Particle;

        if (particleIndex < particles.length) {
          particle = particles[particleIndex];
          particle.isKilled = false;
          particleIndex++;
        } else {
          particle = new Particle();

          const randomPos = generateRandomPos(
            (canvas.width / dpr) / 2,
            (canvas.height / dpr) / 2,
            (canvas.width / dpr + canvas.height / dpr) / 2
          );
          particle.pos.x = randomPos.x;
          particle.pos.y = randomPos.y;

          particle.maxSpeed = Math.random() * 6 + 4;
          particle.maxForce = particle.maxSpeed * 0.05;
          particle.particleSize = Math.random() * 6 + 6;
          particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;

          particles.push(particle);
        }

        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        };
        particle.targetColor = newColor;
        particle.colorWeight = 0;

        particle.target.x = x;
        particle.target.y = y;
      }
    }

    const killWidth = canvas.width / dpr;
    const killHeight = canvas.height / dpr;
    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(killWidth, killHeight);
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = particlesRef.current;

    // If the canvas is off-screen, skip rendering work but keep the RAF loop alive
    if (!isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    // Clear previous frame but keep canvas fully transparent so it blends with the hero background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.move();
      particle.draw(ctx, drawAsPoints);

      if (particle.isKilled) {
        const dpr = window.devicePixelRatio || 1;
        const widthCss = canvas.width / dpr;
        const heightCss = canvas.height / dpr;
        if (particle.pos.x < 0 || particle.pos.x > widthCss || particle.pos.y < 0 || particle.pos.y > heightCss) {
          particles.splice(i, 1);
        }
      }
    }

    if (mouseRef.current.isPressed && mouseRef.current.isRightClick) {
      particles.forEach((particle) => {
        const distance = Math.hypot(particle.pos.x - mouseRef.current.x, particle.pos.y - mouseRef.current.y);
        if (distance < 50) {
          particle.kill(canvas.width, canvas.height);
        }
      });
    }

    frameCountRef.current++;
    if (frameCountRef.current % 240 === 0) {
      wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
      nextWord(words[wordIndexRef.current], canvas);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || 800;
    const height = rect.height || 200;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Observe visibility to pause animation when off-screen (better performance & fewer scroll glitches)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === canvas) {
            isVisibleRef.current = entry.isIntersecting;
          }
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    nextWord(words[0], canvas);
    animate();

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true;
      mouseRef.current.isRightClick = e.button === 2;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false;
      mouseRef.current.isRightClick = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      observer.disconnect();
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [words]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-32 sm:h-40 md:h-48 lg:h-56 rounded-2xl border border-emerald-200/60 dark:border-emerald-500/40 bg-emerald-50/80 dark:bg-slate-950/80 shadow-[0_0_80px_rgba(45,212,191,0.25)]"
      />
    </div>
  );
}
