import React, { useRef, useEffect } from 'react';

const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Adjust density based on screen size
    const numParticles = 45; // Reduced from 80 for performance and less clutter
    const connectionDistance = 110; // Reduced to prevent a tangled mess

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4; // Slowed down significantly
        this.vy = (Math.random() - 0.5) * 0.4; // Slowed down significantly
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
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Subtle Gaussian blur glow (reduced for performance)
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.isRed ? '#e61d2b' : '#96c8ff';
        
        ctx.fillStyle = this.isRed ? 'rgba(230, 29, 43, 0.9)' : 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        // Reset shadow immediately so lines don't get blurred
        ctx.shadowBlur = 0;
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw rich navy gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a192f');
      gradient.addColorStop(1, '#020c1b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect particles with lines
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            const opacity = 1 - distance / connectionDistance;
            
            // Subtle red glow if connecting a red node, otherwise white/blue
            if (particles[i].isRed || particles[j].isRed) {
              ctx.strokeStyle = `rgba(230, 29, 43, ${opacity * 0.25})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
            }
            
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
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
