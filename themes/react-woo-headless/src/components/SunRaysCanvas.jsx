import React, { useEffect, useRef } from 'react';

const SunRaysCanvas = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let rotation = 0;

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set center point (top right corner, slightly offset)
      const centerX = canvas.width + canvas.width * 0.1; // Beyond right edge
      const centerY = -canvas.height * 0.15; // Above viewport for dramatic rays

      // Save context state
      ctx.save();

      // Translate to center and rotate
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.translate(-centerX, -centerY);

      // Number of rays
      const numRays = 32;
      const rayAngle = (Math.PI * 2) / numRays;

      // Enable smooth rendering
      ctx.globalCompositeOperation = 'lighter'; // Blend mode for softer overlaps

      // Draw rays with blur effect
      for (let i = 0; i < numRays; i++) {
        const angle = i * rayAngle;
        const isLightRay = i % 2 === 0;

        // Create gradient for each ray - smoother transitions
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          canvas.height * 2
        );

        if (isLightRay) {
          // Light rays - very soft purple/indigo
          gradient.addColorStop(0, 'rgba(139, 125, 184, 0.12)');
          gradient.addColorStop(0.2, 'rgba(139, 125, 184, 0.08)');
          gradient.addColorStop(0.4, 'rgba(99, 102, 241, 0.04)');
          gradient.addColorStop(0.7, 'rgba(99, 102, 241, 0.015)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        } else {
          // Alternating rays - lighter/subtler
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
          gradient.addColorStop(0.2, 'rgba(168, 85, 247, 0.05)');
          gradient.addColorStop(0.4, 'rgba(147, 51, 234, 0.025)');
          gradient.addColorStop(0.7, 'rgba(147, 51, 234, 0.01)');
          gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
        }

        // Draw ray with smooth edges using blur shadow
        ctx.shadowBlur = 60; // Add blur for soft edges
        ctx.shadowColor = isLightRay ? 'rgba(139, 125, 184, 0.3)' : 'rgba(168, 85, 247, 0.2)';

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        const rayLength = Math.max(canvas.width, canvas.height) * 2.5;
        const raySpread = rayAngle / 3.5; // Narrower rays for more elegance

        // Calculate ray edges with smoother spread
        const x1 = centerX + Math.cos(angle - raySpread) * rayLength;
        const y1 = centerY + Math.sin(angle - raySpread) * rayLength;
        const x2 = centerX + Math.cos(angle + raySpread) * rayLength;
        const y2 = centerY + Math.sin(angle + raySpread) * rayLength;

        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fill();
      }

      // Reset shadow and composite mode
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';

      // Restore context
      ctx.restore();

      // Increment rotation (slow rotation)
      rotation += 0.001; // Adjust speed here (lower = slower)

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default SunRaysCanvas;
