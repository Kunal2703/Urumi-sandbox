/**
 * Blog Hero Canvas Background Component
 * Animated gradient canvas for blog hero section
 * @author Urumi.ai
 */

import React, { useEffect, useRef } from 'react';

function BlogHeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation parameters
    let time = 0;

    // Gradient blob positions
    const blobs = [
      { x: 0.2, y: 0.3, radius: 0.4, speedX: 0.0003, speedY: 0.0002 },
      { x: 0.8, y: 0.6, radius: 0.35, speedX: -0.0002, speedY: 0.0003 },
      { x: 0.5, y: 0.5, radius: 0.3, speedX: 0.0002, speedY: -0.0002 }
    ];

    // Pastel indigo/purple palette
    const colors = [
      { r: 220, g: 210, b: 255 }, // Very light lavender
      { r: 240, g: 230, b: 255 }, // Lighter lavender
      { r: 255, g: 240, b: 250 }, // Very light pink
      { r: 230, g: 240, b: 255 }  // Very light blue
    ];

    const animate = () => {
      time += 1;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw blobs
      blobs.forEach((blob, index) => {
        // Update position
        blob.x += blob.speedX;
        blob.y += blob.speedY;

        // Bounce off edges
        if (blob.x < 0 || blob.x > 1) blob.speedX *= -1;
        if (blob.y < 0 || blob.y > 1) blob.speedY *= -1;

        // Create radial gradient
        const gradient = ctx.createRadialGradient(
          blob.x * canvas.width,
          blob.y * canvas.height,
          0,
          blob.x * canvas.width,
          blob.y * canvas.height,
          blob.radius * Math.max(canvas.width, canvas.height)
        );

        const color = colors[index % colors.length];
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Add subtle overlay gradient
      const overlayGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      overlayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      overlayGradient.addColorStop(1, 'rgba(243, 232, 255, 0.2)');
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
}

export default BlogHeroCanvas;
