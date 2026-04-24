'use client';
import { useEffect, useRef } from 'react';

export default function WaveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationId;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    };

    const drawWave = (offset, amplitude, frequency, speed, color1, color2, alpha) => {
      const width = canvas.getBoundingClientRect().width;
      const height = canvas.getBoundingClientRect().height;

      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x += 2) {
        const normalizedX = x / width;
        const mouseInfluence = Math.sin((normalizedX - mouseX) * Math.PI) * 20 * (1 - Math.abs(normalizedX - mouseX));
        const y = height * offset +
          Math.sin(normalizedX * frequency + time * speed) * amplitude +
          Math.sin(normalizedX * frequency * 0.5 + time * speed * 1.3) * amplitude * 0.5 +
          mouseInfluence;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.5, color2);
      gradient.addColorStop(1, color1);

      ctx.fillStyle = gradient;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      const width = canvas.getBoundingClientRect().width;
      const height = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, width, height);

      if (prefersReducedMotion) {
        // Static gradient fallback
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // Layer 1 - Deep background wave
      drawWave(0.75, 30, 4, 0.3, 'rgba(59, 130, 246, 0.06)', 'rgba(139, 92, 246, 0.06)', 1);

      // Layer 2 - Mid wave
      drawWave(0.8, 25, 5, 0.5, 'rgba(59, 130, 246, 0.04)', 'rgba(6, 182, 212, 0.04)', 1);

      // Layer 3 - Front wave
      drawWave(0.85, 20, 6, 0.7, 'rgba(139, 92, 246, 0.03)', 'rgba(236, 72, 153, 0.03)', 1);

      // Layer 4 - Subtle top wave
      drawWave(0.7, 15, 3, 0.2, 'rgba(59, 130, 246, 0.02)', 'rgba(139, 92, 246, 0.02)', 1);

      time += 0.008;
      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
