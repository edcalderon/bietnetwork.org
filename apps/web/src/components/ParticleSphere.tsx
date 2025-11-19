'use client';

import React, { useState, useEffect, useRef } from 'react';

// 2D Canvas Particle Sphere Component
const ParticleSphereCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;
        let particles: Particle[] = [];
        const mouse = { x: null as number | null, y: null as number | null, radius: 150 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            radius: number;
            angle: number;
            y: number;
            size: number;
            color: string;

            constructor(radius: number, angle: number, y: number) {
                this.radius = radius;
                this.angle = angle;
                this.y = y;
                this.size = 2;
                this.color = `rgba(16, 185, 129, ${Math.random() * 0.5 + 0.2})`; // Biet Network green
            }

            draw(rotation: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
                if (!canvas || !ctx) return;
                
                const x3d = this.radius * Math.cos(this.angle + rotation);
                const z3d = this.radius * Math.sin(this.angle + rotation);
                
                // Simple 3D projection
                const scale = 300 / (300 + z3d);
                const x2d = (x3d * scale) + canvas.width / 2;
                const y2d = (this.y * scale) + canvas.height / 2;

                // Mouse interaction
                let dx = (mouse.x || 0) - x2d;
                let dy = (mouse.y || 0) - y2d;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let force = 0;
                if(distance < mouse.radius) {
                    force = (mouse.radius - distance) / mouse.radius;
                }
                
                const finalSize = this.size + force * 4;
                const finalColor = distance < mouse.radius ? `rgba(255, 255, 255, ${0.5 + force * 0.5})` : this.color;

                ctx.beginPath();
                ctx.arc(x2d, y2d, finalSize, 0, Math.PI * 2);
                ctx.fillStyle = finalColor;
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            const numParticles = 3000;
            for (let i = 0; i < numParticles; i++) {
                const radius = Math.random() * 100 + 80;
                const angle = Math.random() * Math.PI * 2;
                const y = (Math.random() - 0.5) * 200;
                particles.push(new Particle(radius, angle, y));
            }
        };

        let rotation = 0;
        const animate = () => {
            rotation += 0.001;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => p.draw(rotation, canvas, ctx));
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        init();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" />;
};

const ParticleSphere = () => {
    return (
        <div className="relative h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
            <ParticleSphereCanvas />
        </div>
    );
};

export default ParticleSphere;
