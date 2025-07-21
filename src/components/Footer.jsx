// Import React library for building the Footer component
import React from "react";

// Footer component: displays contact info, navigation, and social links
const Footer = () => {
  // Social media links for the footer section
  const socialLinks = [
    {
      label: "GitHub",
      url: "https://github.com/ghulam36460",
      icon: "github.svg",
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/ghulam-murtaza-a021292a0/",
      icon: "linkedin.svg",
    },
    {
      label: "X",
      url: "https://x.com/gmk36460",
      icon: "x.svg",
    },
    {
      label: "Instagram",
      url: "https://www.instagram.com/ghulam_________",
      icon: "instagram.svg",
    },
        {
      label: "CV",
      url: "https://example.com/your-cv",
      icon: "cv.svg",
    },
  ];

  // Quick navigation links for the footer
  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Projects", href: "#work" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ];

  // Scroll to top button handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Left Section - Personal Info */}
          <div className="footer-section footer-info">
            <h3 className="footer-name">Ghulam</h3>
            <p className="footer-title">Sofware Developer</p>

            <div className="footer-contact">
              <a href="mailto:gmk36460@gmail.com" className="footer-email">
                gmk36460@gmail.com
              </a>
            </div>
          </div>

          {/* Center Section - Quick Navigation */}
          <div className="footer-section footer-navigation">
            <nav className="footer-nav">
              {/* Render quick navigation links */}
              {quickLinks.map(({ label, href }) => (
                <a key={label} href={href} className="footer-nav-link">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right Section - Social Links */}
          <div className="footer-section footer-social-section">
            <div className="footer-social">
              {/* Render social media links with icons */}
              {socialLinks.map(({ label, url, icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  title={label}
                  aria-label={label}
                >
                  <img
                    loading="lazy"
                    src={`assets/images/social-links/${icon}`}
                    alt={label}
                    className="footer-social-icon"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-text">
            {/* Display current year dynamically */}
            © {new Date().getFullYear()} Ghulam Murtaza. All rights reserved.
          </p>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="back-to-top"
            aria-label="Scroll to top"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3.5L12.5 8H9V12.5H7V8H3.5L8 3.5Z"
                fill="currentColor"
              />
            </svg>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

// Export Footer component as default
export default Footer;
// End of Footer.jsx
