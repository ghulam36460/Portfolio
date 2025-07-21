import React, { useEffect } from "react";
// Import Header component (top navigation)
import Header from "./components/Header";
// Import TrustedBy component (client logos section)
import TrustedBy from "./components/TrustedBy";
// Import Work component (portfolio/work section)
import Work from "./components/Work";
// Import Skills component (skills showcase)
import Skills from "./components/Skills";
// Import SkillsWebGL component (3D skills visualization)
import SkillsWebGL from "./components/SkillsWebGL";
// Import Contact component (contact form)
import Contact from "./components/Contact";
// Import Footer component (footer section)
import Footer from "./components/Footer";

// Main App component - root of the application
function App() {
  // useEffect runs side effects after component mounts
  useEffect(() => {

    // Theme initialization: get theme from localStorage or default to 'dark'
    const theme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(theme); // Add theme class to body

    // Work section animations: select all work boxes and images
    const workEls = document.querySelectorAll(".work-box");
    const workImgs = document.querySelectorAll(".work-img");

    // Add transform class to all work images for initial animation
    workImgs.forEach((workImg) => workImg.classList.add("transform"));

    // Create IntersectionObserver for work section animations
    let observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const [textbox, picture] = Array.from(entry.target.children);
        if (entry.isIntersecting) {
          picture.classList.remove("transform"); // Remove transform when visible
          Array.from(textbox.children).forEach(
            (el) => (el.style.animationPlayState = "running"), // Start text animations
          );
        }
      },
      { threshold: 0.3 }, // Trigger when 30% visible
    );

    // Observe each work element for animation
    workEls.forEach((workEl) => {
      observer.observe(workEl);
    });


    // Rotating logos animation for TrustedBy section
    const trustedBySection = document.querySelector(".client");
    if (trustedBySection) {
      const logosWrappers = trustedBySection.querySelectorAll(".logo-group");
      // Helper function to pause execution for animation timing
      const sleep = (number) => new Promise((res) => setTimeout(res, number));

      // Intersection observer to start animation when section is visible
      const trustedObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Start the rotating animation after section comes into view
              setTimeout(() => {
                logosWrappers.forEach(async (logoWrapper, i) => {
                  const logos = Array.from(logoWrapper.children);
                  await sleep(1400 * i); // Stagger animation for each logo group

                  // Initial animation to show the first logo
                  logos.forEach((logo, index) => {
                    if (index === 1) {
                      logo.classList.remove("hide", "to-top", "to-bottom");
                    } else {
                      logo.classList.add("hide");
                    }
                  });

                  // Rotate logos every 5.6 seconds
                  setInterval(() => {
                    let temp = logos[0];
                    logos[0] = logos[1];
                    logos[1] = logos[2];
                    logos[2] = temp;
                    logos[0].classList.add("hide", "to-top");
                    logos[1].classList.remove("hide", "to-top", "to-bottom");
                    logos[2].classList.add("hide", "to-bottom");
                  }, 5600);
                });
              }, 500); // Delay animation start
              trustedObserver.unobserve(entry.target); // Stop observing after animation starts
            }
          });
        },
        { threshold: 0.3 }, // Trigger when 30% visible
      );

      trustedObserver.observe(trustedBySection);
    }


    // Set current year in footer
    const yearEl = document.querySelector(".footer-text span");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear(); // Set year dynamically
    }

    // Cleanup function: disconnect observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array: runs once on mount

  return (
    <>
      {/* Render Header (navigation bar) */}
      <Header />
      {/* Main content area */}
      <main id="home">
        {/* TrustedBy section (client logos) */}
        <TrustedBy />
        {/* Work section (portfolio/work showcase) */}
        <Work />
        {/* Skills section (skills showcase) */}
        <Skills />
        {/* Contact section (contact form) */}
        <Contact />
      </main>
      {/* Footer section */}
      <Footer />
    </>
  );
}

// Export App component as default
export default App;
// End of App.jsx
