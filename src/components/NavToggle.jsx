import Icon from "./Icon";

const NavToggle = ({ menuOpen, onClick, className }) => {
  return (
    <button
      type="button"
      className={`nav-toggle ${className || ""}`}
      aria-label="Menu"
      aria-expanded={menuOpen}
      onClick={onClick}
    >
      <div className="nav-toggle-inner">
        <Icon
          icon="menu"
          className={`nav-toggle-icon menu-icon ${menuOpen ? "hidden" : ""}`}
          size={24}
        />
        <Icon
          icon="close"
          className={`nav-toggle-icon close-icon ${!menuOpen ? "hidden" : ""}`}
          size={24}
        />
      </div>
    </button>
  );
};

export default NavToggle;
