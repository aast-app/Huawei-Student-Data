import React, { useRef, useEffect } from 'react';

const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let bgGradient = null;
    
    // Dynamic density: aggressively reduce count on mobile for max performance
    const getNumParticles = () => window.innerWidth < 768 ? 12 : 30;
    let numParticles = getNumParticles();
    const connectionDistance = 110; 
    const connectionDistanceSq = connectionDistance * connectionDistance; // Avoid sqrt when possible

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1; 
        this.isRed = Math.random() > 0.85; 
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        // PERFORMANCE: Fake glow using simple transparent circle instead of native shadowBlur (which destroys FPS)
        if (this.isRed) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(230, 29, 43, 0.15)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isRed ? 'rgba(230, 29, 43, 0.9)' : 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numParticles = getNumParticles();
      
      // PERFORMANCE: Cache the gradient instead of rebuilding it 60 times a second
      bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, '#0a192f');
      bgGradient.addColorStop(1, '#020c1b');
      
      init();
    };
    
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      // PERFORMANCE: Use cached gradient background
      if (bgGradient) {
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect particles with lines
        // PERFORMANCE: Start j at i + 1 to avoid checking self
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          // PERFORMANCE: Check squared distance first to avoid heavy Math.sqrt calculation on every pair
          if (distSq < connectionDistanceSq) {
            const distance = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            const opacity = 1 - distance / connectionDistance;
            
            if (particles[i].isRed || particles[j].isRed) {
              ctx.strokeStyle = `rgba(230, 29, 43, ${opacity * 0.45})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.25})`;
            }
            
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default NetworkBackground;
