import React, { useRef, useEffect, useState } from "react";

// Professional Skills with subtle WebGL enhancement
const SkillsWebGL = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationIdRef = useRef();

  const skillGroups = [
    [
      { src: "assets/images/skills/react.webp", alt: "React", title: "React" },
      {
        src: "assets/images/skills/js.webp",
        alt: "JavaScript",
        title: "JavaScript",
      },
      {
        src: "assets/images/skills/typescript.webp",
        alt: "TypeScript",
        title: "TypeScript",
      },
    ],
    [
      {
        src: "assets/images/skills/next-js.webp",
        alt: "Next.js",
        title: "Next.js",
      },
      {
        src: "assets/images/skills/node-js.webp",
        alt: "Node.js",
        title: "Node.js",
      },
      {
        src: "assets/images/skills/tailwind.png",
        alt: "Tailwind CSS",
        title: "Tailwind CSS",
      },
    ],
    [
      { src: "assets/images/skills/git.webp", alt: "Git", title: "Git" },
      { src: "assets/images/skills/html.webp", alt: "HTML5", title: "HTML5" },
      {
        src: "assets/images/skills/bootstrap.png",
        alt: "Bootstrap",
        title: "Bootstrap",
      },
    ],
    [
      {
        src: "assets/images/skills/graphql.webp",
        alt: "GraphQL",
        title: "GraphQL",
      },
      {
        src: "assets/images/skills/gsap-logo-dNe6788698.webp",
        alt: "GSAP",
        title: "GSAP",
      },
      {
        src: "assets/images/skills/WordPress-Emblem.png",
        alt: "WordPress",
        title: "WordPress",
      },
    ],
  ];

  // Subtle WebGL particle enhancement
  useEffect(() => {
    if (!canvasRef.current || !webglSupported) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setWebglSupported(false);
      return;
    }

    // Particles array
    const particles = [];
    const particleCount = 25; // Reduced for subtlety

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.3 + 0.1,
        size: Math.random() * 2 + 0.5,
      });
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const animate = () => {
      if (!isVisible) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Draw particle
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3,
        );
        gradient.addColorStop(0, `rgba(74, 144, 226, ${particle.alpha})`);
        gradient.addColorStop(1, "rgba(74, 144, 226, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle lines
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.strokeStyle = `rgba(74, 144, 226, ${0.1 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isVisible, webglSupported]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            setIsVisible(true);

            // Add staggered animation to each skill with professional timing
            const logos = entry.target.querySelectorAll(".logo");
            logos.forEach((logo, index) => {
              setTimeout(() => {
                logo.classList.add("animate-in");
                logo.classList.remove("hide");
              }, index * 150); // Slightly slower for more elegance
            });
          }
        });
      },
      { threshold: 0.2 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSkillHover = (skillTitle, isHovering) => {
    // Professional interaction feedback
    if (isHovering) {
      console.log(`Showcasing ${skillTitle} expertise`);
    }
  };

  return (
    <section className="skills skills-professional" ref={containerRef}>
      <div className="container">
        <h2 className="h2" id="skills">
          My Skills
        </h2>

        {/* Subtle Canvas Background Enhancement */}
        {webglSupported && (
          <canvas
            ref={canvasRef}
            className="webgl-subtle-bg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              pointerEvents: "none",
              opacity: 0.6,
            }}
          />
        )}

        <div className="logos">
          {skillGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="logo-group">
              {group.map((skill, skillIndex) => (
                <img
                  key={skillIndex}
                  src={skill.src}
                  alt={skill.alt}
                  className="logo hide professional-enhanced"
                  loading="lazy"
                  title={skill.title}
                  onMouseEnter={() => handleSkillHover(skill.title, true)}
                  onMouseLeave={() => handleSkillHover(skill.title, false)}
                  style={{
                    animationDelay: `${(groupIndex * 3 + skillIndex) * 0.15}s`,
                    zIndex: 10,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsWebGL;
