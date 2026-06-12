/**
 * Blog Hero Canvas — ambient warm-glow backdrop
 *
 * Soft cream/orange blobs that breathe behind the hero content. Replaces
 * the legacy pastel-indigo/lavender canvas (which clashed with the design
 * system v1 cream/coffee/orange palette).
 *
 * Reads --color-accent and --color-bg from the document at mount so it
 * naturally follows the active theme (light cream / dark coffee).
 *
 * @author Urumi.ai
 */

import React, { useEffect, useRef } from 'react';

/** Parse common CSS color forms (#rrggbb, #rgb, rgb()/rgba()) into RGB tuple. */
function parseColor(value, fallback) {
    if (!value) return fallback;
    const s = value.trim();
    if (s.startsWith('#')) {
        const hex = s.slice(1);
        const full = hex.length === 3
            ? hex.split('').map((c) => c + c).join('')
            : hex.slice(0, 6);
        return {
            r: parseInt(full.slice(0, 2), 16),
            g: parseInt(full.slice(2, 4), 16),
            b: parseInt(full.slice(4, 6), 16),
        };
    }
    const m = s.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (m) {
        return { r: +m[1], g: +m[2], b: +m[3] };
    }
    return fallback;
}

function BlogHeroCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        // Sample design-system tokens from <html>. Re-read on theme toggle
        // is out of scope here — the canvas re-mounts with the page when
        // the user toggles theme on a different surface, so palette stays
        // in sync over time.
        const root = getComputedStyle(document.documentElement);
        const accent = parseColor(root.getPropertyValue('--color-accent'), { r: 220, g: 80, b: 0 });
        const bg = parseColor(root.getPropertyValue('--color-bg'), { r: 253, g: 250, b: 246 });

        // Three soft accent blobs + one bg-tone highlight. Alphas are low
        // (max 0.18) so the blobs read as ambient light, not chrome —
        // they're a backdrop for the headline, never a feature.
        const blobs = [
            { x: 0.18, y: 0.32, radius: 0.45, color: accent, alpha: 0.16, speedX:  0.00018, speedY:  0.00012 },
            { x: 0.78, y: 0.62, radius: 0.40, color: accent, alpha: 0.10, speedX: -0.00014, speedY:  0.00020 },
            { x: 0.52, y: 0.48, radius: 0.32, color: accent, alpha: 0.06, speedX:  0.00010, speedY: -0.00012 },
            { x: 0.88, y: 0.18, radius: 0.28, color: bg,     alpha: 0.30, speedX: -0.00008, speedY:  0.00010 },
        ];

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            blobs.forEach((blob) => {
                blob.x += blob.speedX;
                blob.y += blob.speedY;
                if (blob.x < 0 || blob.x > 1) blob.speedX *= -1;
                if (blob.y < 0 || blob.y > 1) blob.speedY *= -1;

                const cx = blob.x * canvas.width;
                const cy = blob.y * canvas.height;
                const r  = blob.radius * Math.max(canvas.width, canvas.height);
                const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                const { r: cr, g: cg, b: cb } = blob.color;
                gradient.addColorStop(0,   `rgba(${cr}, ${cg}, ${cb}, ${blob.alpha})`);
                gradient.addColorStop(0.6, `rgba(${cr}, ${cg}, ${cb}, ${blob.alpha * 0.4})`);
                gradient.addColorStop(1,   `rgba(${cr}, ${cg}, ${cb}, 0)`);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            });

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
            aria-hidden="true"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
}

export default BlogHeroCanvas;
