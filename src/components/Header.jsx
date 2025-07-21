import React, { useState, useEffect, Suspense } from "react";
import NavToggle from "./NavToggle";
import ThemeToggle from "./ThemeToggle";
import Icon from "./Icon";
import { DisplacementSphere } from "./DisplacementSphere";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleNav = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent screen from scrolling when menu is opened
    document.body.classList.toggle("lock-screen");
  };

  const closeNav = () => {
    setIsMenuOpen(false);
    document.body.classList.remove("lock-screen");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeNav();
      }
    };

    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const socialLinks = [
    { label: "GitHub", url: "https://github.com/ghulam36460", icon: "github" },
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/ghulam-murtaza-a021292a0/",
      icon: "linkedin",
    },
    {
      label: "X",
      url: "https://x.com/gmk36460",
      icon: "x",
    },
    {
      label: "CV",
      url: "/assets/images/cv.pdf",
      icon: "file",
    },
  ];

  return (
    <header className="header" style={{ position: "relative" }}>
      {/* Background Sphere */}
      <Suspense>
        <DisplacementSphere />
      </Suspense>

      {/* Theme Toggle (top left, fixed) */}
      <div style={{ position: "fixed", top: 28, left: 32, zIndex: 1000 }}>
        <ThemeToggle />
      </div>

      {/* Navigation Toggle (top right, absolute) */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }}>
        <NavToggle menuOpen={isMenuOpen} onClick={toggleNav} />
      </div>

      {/* Navigation Menu */}
      <nav className={`modern-nav${isMenuOpen ? " nav-open" : ""}`}>
        <div className="nav-content">
          <div className="nav-links">
            {[
              { href: "#", label: "Home" },
              { href: "#work", label: "My Work" },
              { href: "#skills", label: "My Skills" },
              { href: "#contact", label: "Contact" },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="nav-link"
                onClick={closeNav}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="nav-social">
            {socialLinks.map(({ label, url, icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-social-link"
                aria-label={label}
              >
                <Icon icon={icon} size={20} />
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Header Content */}
      <div className="container">
        <div className="header-textbox">
          <h1 className="h1">
            <span>Hi, I&apos;m Ghulam</span>
            <span>Software Developer</span>
          </h1>
          <p className="header-text">
            I focuses on backend development, AI, and ML, specializing in creating UX-rich, accessible, and high-performance websites and web applications.
          </p>
          <div className="header-btns">
            <a href="#contact" className="btn btn-cta">
              Hire me
            </a>
            <a href="#work" className="btn btn-secondary">
              See my work
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
