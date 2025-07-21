// Import React and hooks for side effects and refs
import React, { useEffect, useRef, useState } from "react";

// Skills component: displays skill logos with modern glassmorphic design
const Skills = () => {
  // Ref for the skills section to observe visibility
  const skillsRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Modern skill categories with enhanced data
  const skillCategories = [
    {
      id: "frontend",
      category: "Frontend",
      icon: "🎨",
      description: "Creating beautiful user experiences",
      skills: [
        { src: "assets/images/skills/React.svg", alt: "React", title: "React", proficiency: 95, color: "#61dafb" },
        { src: "assets/images/skills/JS.svg", alt: "JavaScript", title: "JavaScript", proficiency: 90, color: "#f7df1e" },
        { src: "assets/images/skills/HTML.svg", alt: "HTML5", title: "HTML5", proficiency: 98, color: "#e34f26" },
        { src: "assets/images/skills/CSS.svg", alt: "CSS3", title: "CSS3", proficiency: 92, color: "#1572b6" },
        { src: "assets/images/skills/nextjs.svg", alt: "Next.js", title: "Next.js", proficiency: 88, color: "#000000" },
        { src: "assets/images/skills/tailwind.png", alt: "Tailwind CSS", title: "Tailwind", proficiency: 94, color: "#06b6d4" },
        { src: "assets/images/skills/bootstrap.png", alt: "Bootstrap", title: "Bootstrap", proficiency: 85, color: "#7952b3" },
      ]
    },
    {
      id: "backend",
      category: "Backend & Languages",
      icon: "💻",
      description: "Building robust server solutions",
      skills: [
        { src: "assets/images/skills/Python.svg", alt: "Python", title: "Python", proficiency: 92, color: "#3776ab" },
        { src: "assets/images/skills/C++.svg", alt: "C++", title: "C++", proficiency: 80, color: "#00599c" },
        { src: "assets/images/skills/C.svg", alt: "C", title: "C", proficiency: 78, color: "#a8b9cc" },
        { src: "assets/images/skills/node-js.webp", alt: "Node.js", title: "Node.js", proficiency: 87, color: "#339933" },
        { src: "assets/images/skills/typescript.webp", alt: "TypeScript", title: "TypeScript", proficiency: 89, color: "#3178c6" },
      ]
    },
    {
      id: "tools",
      category: "Databases & Tools",
      icon: "🛠️",
      description: "Managing data and development workflow",
      skills: [
        { src: "assets/images/skills/MongoDB.svg", alt: "MongoDB", title: "MongoDB", proficiency: 85, color: "#47a248" },
        { src: "assets/images/skills/Postgresql.svg", alt: "PostgreSQL", title: "PostgreSQL", proficiency: 82, color: "#336791" },
        { src: "assets/images/skills/Git.svg", alt: "Git", title: "Git", proficiency: 95, color: "#f05032" },
        { src: "assets/images/skills/GitHub.svg", alt: "GitHub", title: "GitHub", proficiency: 90, color: "#181717" },
        { src: "assets/images/skills/Linux.svg", alt: "Linux", title: "Linux", proficiency: 88, color: "#fcc624" },
        { src: "assets/images/skills/bash.svg", alt: "Bash", title: "Bash", proficiency: 84, color: "#4eaa25" },
        { src: "assets/images/skills/PowerShell.svg", alt: "PowerShell", title: "PowerShell", proficiency: 75, color: "#5391fe" },
      ]
    },
    {
      id: "datascience",
      category: "Data Science & Mobile",
      icon: "📱",
      description: "Analytics and cross-platform development",
      skills: [
        { src: "assets/images/skills/Pandas.svg", alt: "Pandas", title: "Pandas", proficiency: 88, color: "#150458" },
        { src: "assets/images/skills/NumPy.svg", alt: "NumPy", title: "NumPy", proficiency: 85, color: "#013243" },
        { src: "assets/images/skills/Matplotlib.svg", alt: "Matplotlib", title: "Matplotlib", proficiency: 80, color: "#11557c" },
        { src: "assets/images/skills/Pytorch.svg", alt: "PyTorch", title: "PyTorch", proficiency: 78, color: "#ee4c2c" },
        { src: "assets/images/skills/flutter.svg", alt: "Flutter", title: "Flutter", proficiency: 72, color: "#02569b" },
        { src: "assets/images/skills/Qt.svg", alt: "Qt", title: "Qt", proficiency: 70, color: "#41cd52" },
      ]
    }
  ];

  // Enhanced animation system with floating effects
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            
            // Add staggered entrance animations
            const skills = entry.target.querySelectorAll(".skill-item");
            skills.forEach((skill, index) => {
              setTimeout(() => {
                skill.classList.add("animate-in");
                skill.classList.remove("hide");
                
                // Add random floating delay for organic movement
                const floatingDelay = Math.random() * 2000 + 1000;
                setTimeout(() => {
                  skill.classList.add("floating-active");
                }, floatingDelay);
              }, index * 80);
            });

            // Animate category stats with counting effect
            const statValues = entry.target.querySelectorAll(".stat-value");
            statValues.forEach((stat) => {
              const finalValue = parseInt(stat.textContent);
              let currentValue = 0;
              const increment = finalValue / 30;
              
              const countAnimation = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                  stat.textContent = finalValue + (stat.textContent.includes('%') ? '%' : '');
                  clearInterval(countAnimation);
                } else {
                  stat.textContent = Math.floor(currentValue) + (stat.textContent.includes('%') ? '%' : '');
                }
              }, 50);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Add mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const skills = document.querySelectorAll('.skill-item.animate-in');
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      skills.forEach((skill, index) => {
        const intensity = (index % 3 + 1) * 0.5; // Varying intensity
        const xMovement = (clientX / innerWidth - 0.5) * intensity;
        const yMovement = (clientY / innerHeight - 0.5) * intensity;
        
        skill.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced skill interaction with haptic feedback and sound
  const handleSkillClick = (skillTitle, proficiency) => {
    console.log(`${skillTitle}: ${proficiency}% proficiency`);
    
    // Add haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    
    // Create ripple effect
    const createRipple = (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'skill-ripple';
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
      `;
      
      e.currentTarget.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };
    
    // Trigger skill pulse animation
    const skillCards = document.querySelectorAll(`[data-skill="${skillTitle}"]`);
    skillCards.forEach(card => {
      card.classList.add('skill-pulse-active');
      setTimeout(() => card.classList.remove('skill-pulse-active'), 1000);
    });
  };

  // Enhanced category switching with smooth transitions
  const handleCategoryChange = (index) => {
    if (activeCategory === index) return;
    
    // Add smooth transition effect
    const panels = document.querySelectorAll('.skills-category-panel');
    panels.forEach(panel => panel.classList.add('transitioning'));
    
    setTimeout(() => {
      setActiveCategory(index);
      panels.forEach(panel => panel.classList.remove('transitioning'));
    }, 150);
    
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  return (
    <section className="skills modern-skills-2024" id="skills" ref={skillsRef}>
      <div className="container">
        {/* Modern Header */}
        <div className="skills-header">
          <h2 className="h2 skills-title">
            Technical Expertise
          </h2>
          <p className="skills-subtitle">
            Technologies I use to bring ideas to life
          </p>
        </div>

        {/* Interactive Category Navigation */}
        <div className="category-nav">
          {skillCategories.map((category, index) => (
            <button
              key={category.id}
              className={`category-nav-btn ${activeCategory === index ? 'active' : ''}`}
              onClick={() => handleCategoryChange(index)}
              onMouseEnter={() => setActiveCategory(index)}
            >
              <span className="category-nav-icon">{category.icon}</span>
              <span className="category-nav-text">{category.category}</span>
              <div className="category-nav-indicator"></div>
            </button>
          ))}
        </div>

        {/* Skills Grid Container */}
        <div className="skills-grid-container">
          {skillCategories.map((category, categoryIndex) => (
            <div 
              key={category.id}
              className={`skills-category-panel ${activeCategory === categoryIndex ? 'active' : ''}`}
            >
              {/* Skills Grid */}
              <div className="skills-grid-modern">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="skill-item hide"
                    data-skill={skill.title}
                    onMouseEnter={() => setHoveredSkill(`${categoryIndex}-${skillIndex}`)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onClick={(e) => {
                      handleSkillClick(skill.title, skill.proficiency);
                      
                      // Create ripple effect
                      const ripple = document.createElement('div');
                      ripple.className = 'skill-ripple';
                      const rect = e.currentTarget.getBoundingClientRect();
                      const size = Math.max(rect.width, rect.height);
                      const x = e.clientX - rect.left - size / 2;
                      const y = e.clientY - rect.top - size / 2;
                      
                      ripple.style.cssText = `
                        width: ${size}px;
                        height: ${size}px;
                        left: ${x}px;
                        top: ${y}px;
                      `;
                      
                      e.currentTarget.appendChild(ripple);
                      setTimeout(() => ripple.remove(), 600);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${skill.title} - ${skill.proficiency}% proficiency`}
                  >
                    {/* Skill Card */}
                    <div className="skill-card">
                      {/* Proficiency Ring */}
                      <div className="proficiency-ring">
                        <svg className="proficiency-circle" viewBox="0 0 36 36">
                          <path
                            className="circle-bg"
                            d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="circle-progress"
                            strokeDasharray={`${skill.proficiency}, 100`}
                            d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                            style={{ '--skill-color': skill.color }}
                          />
                        </svg>
                        <div className="skill-icon-container">
                          <img
                            src={skill.src}
                            alt={skill.alt}
                            className="skill-icon-modern"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Skill Info */}
                      <div className="skill-info">
                        <h4 className="skill-title-modern">{skill.title}</h4>
                        <div className="skill-proficiency">
                          <div className="proficiency-bar">
                            <div 
                              className="proficiency-fill"
                              style={{ 
                                width: `${skill.proficiency}%`,
                                backgroundColor: skill.color 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Hover Effects */}
                      {hoveredSkill === `${categoryIndex}-${skillIndex}` && (
                        <div className="skill-tooltip">
                          <span>{skill.proficiency}% Proficiency</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
