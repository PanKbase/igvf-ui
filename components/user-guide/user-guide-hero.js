// node_modules
import PropTypes from "prop-types";

const LOGO_SRC =
  "https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black-tagline.svg";

function formatUpdatedDate(isoDate) {
  if (!isoDate) {
    return null;
  }
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return null;
  }
}

export default function UserGuideHero({ title, updatedAt }) {
  const formatted = formatUpdatedDate(updatedAt);

  return (
    <header className="user-guide-hero">
      <div className="user-guide-hero__inner">
        <img
          className="user-guide-hero__logo"
          src={LOGO_SRC}
          alt="PanKbase"
          width={200}
          height={56}
        />
        <div className="user-guide-hero__text">
          <h1 className="user-guide-hero__title">{title}</h1>
          <p className="user-guide-hero__subtitle">
            A guide to finding, filtering, and accessing pancreatic data
          </p>
          {formatted && (
            <p className="user-guide-hero__updated">Last updated: {formatted}</p>
          )}
        </div>
      </div>
    </header>
  );
}

UserGuideHero.propTypes = {
  title: PropTypes.string.isRequired,
  updatedAt: PropTypes.string,
};
