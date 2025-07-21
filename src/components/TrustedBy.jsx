// TrustedBy component: displays client logos
const TrustedBy = () => {
  // Render trusted client logos in groups
  return (
    <section className="client">
      <div className="container">
        <h2 className="h2">Trusted by</h2>
        <div className="logos">
          {/* Each logo-group contains 3 rotating logos */}
          <div className="logo-group">
            <img
              loading="lazy"
              src="assets/images/trusted-by/stripe.svg"
              alt="Ideacraft"
              className="logo hide to-top"
            />
            <img
              loading="lazy"
              src="assets/images/trusted-by/datastax.svg"
              alt="Golden grid"
              className="logo"
            />
            <img
              loading="lazy"
              src="assets/images/trusted-by/coke.svg"
              alt="Theia"
              className="logo hide to-bottom"
            />
          </div>
          <div className="logo-group">
            <img
              loading="lazy"
              src="assets/images/trusted-by/gm.svg"
              alt="General motors"
              className="logo hide to-top"
            />
            <img
              loading="lazy"
              src="assets/images/trusted-by/shares.svg"
              alt="Chippy"
              className="logo"
            />
            <img
              loading="lazy"
              src="assets/images/trusted-by/shopify.svg"
              alt="Shopify"
              className="logo hide to-bottom"
            />
          </div>
          <div className="logo-group">
            <img
              loading="lazy"
              src="assets/images/trusted-by/agency-elevation.svg"
              alt="Agency elevation"
              className="logo hide to-top"
            />
            <img
              loading="lazy"
              src="assets/images/trusted-by/gitlab.svg"
              alt="Ron jones"
              className="logo"
            />
            <img
              loading="lazy"
              src="assets/images/trusted-by/duolingo.svg"
              alt="Mighty furniture's"
              className="logo hide to-bottom"
            />
          </div>
          <div className="logo-group">
            <img
              loading="lazy"
              src="assets/images/trusted-by/coyote.svg"
              alt="Bulls eye"
              className="logo hide to-top"
            />
            <img
              loading="lazy"
              src="assets/images/trusted-by/astrato.svg"
              alt="Chippy"
              className="logo"
            />
            <img
              loading="lazy"
              src="assets/images/trusted-by/mercado.svg"
              alt="Fastlane"
              className="logo hide to-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Export TrustedBy component as default
export default TrustedBy;
// End of TrustedBy.jsx
