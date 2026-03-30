/**
 * Pearl Gradient Canvas Component
 * Animated iridescent pearl-like gradient background
 *
 * @author Urumi.ai
 */

import React, { useEffect, useRef } from 'react';

const PearlGradientCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create animated sun rays effect
    const animate = () => {
      time += 0.0008; // Slow, elegant animation

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Base gradient with oil-on-water effect - no green tones
      const baseGradient = ctx.createLinearGradient(0, 0, width, height);
      baseGradient.addColorStop(0, '#F5F0FF'); // Brighter lavender
      baseGradient.addColorStop(0.25, '#E8F4FF'); // Bright sky blue
      baseGradient.addColorStop(0.5, '#FFE8F5'); // Bright pink
      baseGradient.addColorStop(0.75, '#FFF5E8'); // Soft yellow
      baseGradient.addColorStop(1, '#FFF0E8'); // Peach
      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, 0, width, height);

      // Sun rays - multiple rays emanating from different points
      const rayCount = 8;
      const centerX = width * 0.5;
      const centerY = height * -0.3; // Above the visible area

      for (let i = 0; i < rayCount; i++) {
        const angle = (Math.PI * 2 * i) / rayCount + time * 0.5;
        const rayLength = Math.max(width, height) * 2;

        // Create ray gradient
        const rayGradient = ctx.createLinearGradient(
          centerX,
          centerY,
          centerX + Math.cos(angle) * rayLength,
          centerY + Math.sin(angle) * rayLength
        );

        // Pastel rainbow colors - each ray has different color
        const intensity = (Math.sin(time * 2 + i * 0.5) + 1) * 0.5; // Pulsing effect

        // Bright iridescent colors - no green tones
        const iridescent = [
          { r: 255, g: 180, b: 230 }, // Bright pink
          { r: 200, g: 180, b: 255 }, // Vivid lavender
          { r: 180, g: 220, b: 255 }, // Electric blue
          { r: 200, g: 230, b: 255 }, // Sky blue
          { r: 255, g: 240, b: 180 }, // Bright yellow
          { r: 255, g: 220, b: 180 }, // Golden peach
          { r: 255, g: 200, b: 180 }, // Coral/peach
          { r: 255, g: 190, b: 220 }  // Rose pink
        ];

        const color = iridescent[i % iridescent.length];

        // Higher opacity for more visible effect
        rayGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${0.4 * intensity})`);
        rayGradient.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, ${0.3 * intensity})`);
        rayGradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${0.15 * intensity})`);
        rayGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)

        // Draw ray as a triangle/cone shape
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);

        ctx.beginPath();
        const rayWidth = 200 + Math.sin(time + i) * 50;
        ctx.moveTo(0, 0);
        ctx.lineTo(rayLength, -rayWidth);
        ctx.lineTo(rayLength, rayWidth);
        ctx.closePath();

        ctx.fillStyle = rayGradient;
        ctx.globalCompositeOperation = 'screen'; // Blend mode for light effect
        ctx.fill();
        ctx.restore();
      }

      // Add floating light particles
      const particleCount = 20;
      for (let i = 0; i < particleCount; i++) {
        const x = width * 0.5 + Math.sin(time * 0.5 + i * 0.3) * width * 0.4;
        const y = height * (0.3 + (Math.sin(time * 0.3 + i * 0.5) + 1) * 0.35);
        const size = 2 + Math.sin(time * 2 + i) * 1.5;
        const opacity = (Math.sin(time * 3 + i * 0.7) + 1) * 0.15;

        // Bright iridescent particles - no green
        const particleIridescent = [
          { r: 255, g: 200, b: 240 }, // Bright pink
          { r: 220, g: 200, b: 255 }, // Bright lavender
          { r: 200, g: 230, b: 255 }, // Bright blue
          { r: 210, g: 235, b: 255 }, // Light blue
          { r: 255, g: 230, b: 200 }, // Golden
          { r: 255, g: 245, b: 200 }  // Bright yellow
        ];
        const particleColor = particleIridescent[i % particleIridescent.length];

        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 5);
        particleGradient.addColorStop(0, `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, ${opacity * 3})`);
        particleGradient.addColorStop(0.5, `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, ${opacity * 1.5})`);
        particleGradient.addColorStop(1, `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, 0)`);

        ctx.fillStyle = particleGradient;
        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath();
        ctx.arc(x, y, size * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add shifting color overlay for oil-on-water effect
      const overlayGradient = ctx.createRadialGradient(
        width * (0.5 + Math.sin(time * 0.3) * 0.2),
        height * (0.5 + Math.cos(time * 0.4) * 0.2),
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );

      // Rotating color overlay
      const hue = (time * 20) % 360;
      overlayGradient.addColorStop(0, `hsla(${hue}, 70%, 85%, 0.2)`);
      overlayGradient.addColorStop(0.5, `hsla(${(hue + 60) % 360}, 70%, 85%, 0.15)`);
      overlayGradient.addColorStop(1, `hsla(${(hue + 120) % 360}, 70%, 85%, 0.1)`);

      ctx.fillStyle = overlayGradient;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillRect(0, 0, width, height);

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default PearlGradientCanvas;
