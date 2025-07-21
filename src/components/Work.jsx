import React, { useRef, useState, useEffect } from "react";
import "../auto-resize-image.css";
// ...existing code...

// Array of project objects, each representing a portfolio item
const projects = [
  {
    title: "GSDashboard",
    description:
      "A modern, real-time dashboard with interactive data visualizations for an engaging user experience.",
    technologies: ["Next.js", "Express", "Node.js", "Vercel", "Prisma"],
    projectUrl: "https://gsdashbord.vercel.app/",
    githubUrl: "https://github.com/ghulam36460/GSDashboard",
    image: "/assets/images/work/gsdashboard.png",
    alt: "GSDashboard",
    status: "Live",
    featured: true,
    category: "",
    color: "emerald",
  },
  {
    title: "Gym App",
    description:
      "A gym management app built with Flutter for tracking workouts, memberships, and user progress.",
    technologies: ["Flutter", "Firebase", "Dart"],
    projectUrl: "https://luminaflow-rdbv2.web.app",
    githubUrl: "https://github.com/ghulam36460/gym-app",
    image: "/assets/images/work/flutteraap.png",
    alt: "Gym App",
    status: "Live",
    featured: true,
    category: "Web",
    color: "blue",
  },
  {
    title: "Parking Management System",
    description:
      "A parking management system,featuring advanced validations, VIP parking, blacklist management, and detailed reporting capabilities.",
    technologies: ["Python", " Tkinter", "ttkbootstrap"],
    projectUrl: "https://github.com/ghulam36460/Parking-Management-System",
    githubUrl: "https://github.com/ghulam36460/Parking-Management-System",
    image: "/assets/images/work/pkmang.png",
    alt: "Parking Management System",
    status: "Beta",
    featured: true,
    category: "Desktop App",
    color: "purple",
  },
  {
    title: "Simple Snake Game",
    description:
      "A modern, high-performance implementation of the classic Snake game.",
    technologies: ["C++", "Qt", "OpenGL", "Dear ImGui"],
    projectUrl: "https://github.com/ghulam36460/Classical-Snake-Game",
    githubUrl: "https://github.com/ghulam36460/Classical-Snake-Game",
    image: "/assets/images/work/snk.png",
    alt: "Simple Snake Game",
    status: "Beta",
    featured: false,
    category: "Windows App",
    color: "orange",
  },
  {
    title: "Modular Snake Game",
    description:
      "High-Performance Modular Snake Game",
    technologies: ["C", "C++", "Cmake"],
    projectUrl: "https://github.com/ghulam36460/Snake-Game",
    githubUrl: "https://github.com/ghulam36460/Snake-Game",
    image: "",
    alt: "High-Performance Modular Snake Game",
    status: "Undevelopment",
    featured: true,
    category: "Windows App",
    color: "green",
  },
  {
    title: "Website HinX",
    description:
      "Creative portfolio builder with drag-and-drop interface and custom themes.",
    technologies: ["Html","CSS", "JS","Vercel"],
    projectUrl: "https://hinx.vercel.app/",
    githubUrl: "https://github.com/Web-Hinx/hinx",
    image: "/assets/images/work/hinx.png",
    alt: "Website HinX",
    status: "Live",
    featured: false,
    category: "Creative",
    color: "pink",
  },
];

const Work = () => {
  // Ref for the scrollable projects grid
  const scrollRef = useRef(null);
  // State to track the currently active card
  const [activeCard, setActiveCard] = useState(0);

  // Scroll tracking with enhanced smooth animations
  // Scroll tracking with enhanced smooth animations
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Handle scroll event to animate cards and update active card
    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const containerWidth = scrollContainer.clientWidth;

      // Calculate active card based on scroll position and cards per view
      const cardsPerView = getCardsPerView();
      const cardWidth = containerWidth / cardsPerView;
      const currentCard = Math.round(scrollLeft / cardWidth);
      setActiveCard(Math.min(currentCard, projects.length - cardsPerView));

      // Add scroll-based animations to visible cards
      const cards = scrollContainer.querySelectorAll(".project-card-modern");
      cards.forEach((card, index) => {
        const cardLeft = index * (cardWidth + 24); // 24px is gap
        const cardCenter = cardLeft + cardWidth / 2;
        const containerCenter = scrollLeft + containerWidth / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        const normalizedDistance = Math.min(distance / (containerWidth / 2), 1);

        // Apply transform based on scroll position
        const scale = 1 - normalizedDistance * 0.05;
        const opacity = 1 - normalizedDistance * 0.3;

        card.style.transform = `scale(${scale})`;
        card.style.opacity = Math.max(opacity, 0.7);
      });
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    // Initial call to set up animations
    handleScroll();

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Get cards per view based on screen size
  // Get cards per view based on screen size
  const getCardsPerView = () => {
    if (typeof window === "undefined") return 3;

    const width = window.innerWidth;
    if (width >= 1400) return 4; // Large monitors: 4 cards
    if (width >= 1025) return 3; // Desktop: 3 cards
    if (width >= 641) return 2; // Tablet: 2 cards
    return 1; // Mobile: 1 card
  };

  // Enhanced navigation with smooth animations
  const scrollToCard = (direction) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const containerWidth = scrollContainer.clientWidth;
    const cardsPerView = getCardsPerView();
    const cardWidth = containerWidth / cardsPerView;
    const gap = 24; // 1.5rem in pixels

    const currentScroll = scrollContainer.scrollLeft;
    const scrollAmount = cardWidth + gap;

    let targetScroll;
    if (direction === "left") {
      targetScroll = Math.max(0, currentScroll - scrollAmount);
    } else {
      const maxScroll = scrollContainer.scrollWidth - containerWidth;
      targetScroll = Math.min(maxScroll, currentScroll + scrollAmount);
    }

    // Add momentum-based easing
    scrollContainer.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });

    // Add haptic feedback if supported
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  // Render work section with project cards, navigation, and indicators
  return (
    <section className="work-section-modern" id="work">
      <div className="work-container">
        {/* Clean Header - NO badges, NO stats */}
        <div className="work-header">
          <h2 className="work-title">
           Projects
          </h2>
          <p className="work-subtitle">
            Modern web projects & innovative solutions crafted with passion and
            precision
          </p>
        </div>

        {/* Projects Grid with Side Navigation */}
        <div className="work-content">
          {/* Left Navigation Button - Positioned in yellow box area */}
          <button
            className="nav-btn nav-btn-left"
            onClick={() => scrollToCard("left")}
            disabled={activeCard === 0}
            aria-label="Previous projects"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Projects Grid Container */}
          <div className="projects-grid-wrapper">
            <div className="projects-grid" ref={scrollRef}>
              {/* Render each project card */}
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  className={`project-card-modern ${project.featured ? "featured" : ""}`}
                  data-category={project.category}
                  style={{ "--card-index": idx }}
                >
                  {/* Project Image with Hover Overlay */}
                  <div className="project-image-container">
                    <img
                      src={project.image}
                      alt={project.alt}
                      className="project-image auto-resize-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                    <div className="image-placeholder">
                      <div className="placeholder-icon">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <span>Preview Coming Soon</span>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`status-badge status-${project.status.toLowerCase()}`}
                    >
                      <span className="status-dot"></span>
                      {project.status}
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="featured-badge">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        Featured
                      </div>
                    )}

                    {/* Hover Overlay with Project Info */}
                    <div className="project-overlay">
                      <div className="overlay-content">
                        <h4 className="overlay-title">{project.title}</h4>
                        <p className="overlay-category">{project.category}</p>
                        <div className="overlay-actions">
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="overlay-btn overlay-btn-primary"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <path
                                d="M15 3H21V9"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <path
                                d="M10 14L21 3"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                            View Live
                          </a>
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="overlay-btn overlay-btn-secondary"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.55C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.7 3.75 17.415C3.33 17.19 2.73 16.605 3.735 16.59C4.68 16.575 5.355 17.49 5.58 17.85C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5808 20.2773 21.0498 21.7438 19.0074C23.2103 16.9651 23.9994 14.5143 24 12C24 5.37 18.63 0 12 0Z" />
                              </svg>
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="project-content">
                    <div className="project-header">
                      <h3 className="project-title">{project.title}</h3>
                      <div className="project-category-tag">
                        {project.category}
                      </div>
                    </div>

                    <p className="project-description">{project.description}</p>

                    <div className="project-tech">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="project-actions">
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        View Project
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M7 17L17 7"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M7 7H17V17"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </a>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                          title="View Source Code"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.55C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.7 3.75 17.415C3.33 17.19 2.73 16.605 3.735 16.59C4.68 16.575 5.355 17.49 5.58 17.85C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5808 20.2773 21.0498 21.7438 19.0074C23.2103 16.9651 23.9994 14.5143 24 12C24 5.37 18.63 0 12 0Z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Navigation Button - Positioned in yellow box area */}
          <button
            className="nav-btn nav-btn-right"
            onClick={() => scrollToCard("right")}
            disabled={activeCard >= projects.length - 1}
            aria-label="Next projects"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Simple Dot Indicators */}
        <div className="work-indicators">
          {/* Render dot indicators for project navigation */}
          {Array.from({
            length: Math.ceil(projects.length / getCardsPerView()),
          }).map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${idx === Math.floor(activeCard / getCardsPerView()) ? "active" : ""}`}
              onClick={() => {
                const scrollContainer = scrollRef.current;
                if (scrollContainer) {
                  const containerWidth = scrollContainer.clientWidth;
                  scrollContainer.scrollTo({
                    left: idx * containerWidth,
                    behavior: "smooth",
                  });
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
