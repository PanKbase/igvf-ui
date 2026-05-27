// node_modules
import Link from "next/link";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function TocList({ sections, activeId, onNavigate }) {
  return (
    <ul className="user-guide-toc__list">
      {sections.map(({ id, label }) => (
        <li key={id}>
          <Link
            href={`#${id}`}
            className={`user-guide-toc__link${activeId === id ? " is-active" : ""}`}
            onClick={() => onNavigate?.(id)}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

TocList.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeId: PropTypes.string,
  onNavigate: PropTypes.func,
};

export default function UserGuideToc({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id || "");

  useEffect(() => {
    if (!sections.length) {
      return undefined;
    }

    const headings = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    if (!headings.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (!sections.length) {
    return null;
  }

  return (
    <>
      <details className="user-guide-toc-mobile">
        <summary>On this page</summary>
        <TocList sections={sections} activeId={activeId} />
      </details>
      <nav className="user-guide-toc-desktop" aria-label="Table of contents">
        <p className="user-guide-toc__heading">On this page</p>
        <TocList sections={sections} activeId={activeId} />
      </nav>
    </>
  );
}

UserGuideToc.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};
