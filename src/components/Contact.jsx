
import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_vmngw9p";
const TEMPLATE_ID = "template_9ulfw0e";
const PUBLIC_KEY = "UJf1RmzYxCS--XUQ9";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "", show: false });
  const [sending, setSending] = useState(false);

  // Auto-dismiss alert after 5 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ type: "", message: "", show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  // Validate fields
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "", show: false });
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setAlert({ type: "error", message: "Please fill all fields correctly.", show: true });
      return;
    }
    setSending(true);
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY);
      setAlert({ type: "success", message: "Message sent successfully!", show: true });
      setForm({ name: "", email: "", message: "" });
      setErrors({});
    } catch (err) {
      setAlert({ type: "error", message: "Failed to send message. Please try again.", show: true });
    }
    setSending(false);
  };

  // Render contact section with form and info
  return (
    <section className="contact">
      <div className="container">
        <h2 className="h2" id="contact">
          Contact Me
        </h2>
        <div className="contact-content">
          <div className="contact-textbox">
            {/* Hire alert indicator */}
            <strong href="#" className="hire-alert">
              <span className="indicator"></span>
              Available for hire
            </strong>
            {/* Contact info text */}
            <p className="contact-text">
              I'm a Software Developer currently focused on Python and C++, with growing experience in web development
              and interest in AI technologies. I'm exploring how software interacts across systems,
              whether that's backend logic, low-level programming, or experimenting with machine learning. I'm still learning, but I build with curiosity, clarity, and consistency.
            </p>
          </div>
          {/* Contact form for user messages */}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={sending}
              />
              {errors.name && (
                <div style={{ color: "#dc2626", fontSize: "0.95em", marginTop: "0.25em" }}>{errors.name}</div>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
                inputMode="email"
                disabled={sending}
              />
              {errors.email && (
                <div style={{ color: "#dc2626", fontSize: "0.95em", marginTop: "0.25em" }}>{errors.email}</div>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="message">How can I help you?</label>
              <textarea
                name="message"
                id="message"
                value={form.message}
                onChange={handleChange}
                required
                disabled={sending}
              ></textarea>
              {errors.message && (
                <div style={{ color: "#dc2626", fontSize: "0.95em", marginTop: "0.25em" }}>{errors.message}</div>
              )}
            </div>
            <button type="submit" className="btn btn-cta" disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </button>
            
            {/* Enhanced Alert positioned after the button - matching website design */}
            {alert.show && (
              <div
                className="contact-alert"
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "8px",
                  border: alert.type === "success" ? "2px solid #10b981" : "2px solid #ef4444",
                  backgroundColor: alert.type === "success" 
                    ? "rgba(16, 185, 129, 0.1)" 
                    : "rgba(239, 68, 68, 0.1)",
                  backdropFilter: "blur(10px)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  animation: "alertSlideIn 0.3s ease-out",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Icon with gradient background */}
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: alert.type === "success" 
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "linear-gradient(135deg, #ef4444, #dc2626)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                    flexShrink: 0,
                    boxShadow: alert.type === "success"
                      ? "0 2px 8px rgba(16, 185, 129, 0.3)"
                      : "0 2px 8px rgba(239, 68, 68, 0.3)",
                  }}
                >
                  {alert.type === "success" ? "✓" : "!"}
                </div>
                
                {/* Message text */}
                <span 
                  style={{ 
                    flex: 1,
                    color: alert.type === "success" ? "#059669" : "#dc2626",
                    fontWeight: "500",
                    fontSize: "0.95rem",
                  }}
                >
                  {alert.message}
                </span>
                
                {/* Modern dismiss button */}
                <button
                  onClick={() => setAlert({ type: "", message: "", show: false })}
                  style={{
                    background: "none",
                    border: "none",
                    color: alert.type === "success" ? "#059669" : "#dc2626",
                    cursor: "pointer",
                    fontSize: "20px",
                    fontWeight: "300",
                    lineHeight: "1",
                    opacity: "0.6",
                    transition: "all 0.2s ease",
                    borderRadius: "4px",
                    padding: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.backgroundColor = alert.type === "success" 
                      ? "rgba(16, 185, 129, 0.1)" 
                      : "rgba(239, 68, 68, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "0.6";
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
