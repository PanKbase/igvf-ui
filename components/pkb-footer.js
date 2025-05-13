import React from "react";
import Link from "next/link";
import Image from "next/image";

// Using the same pkbMenu structure from the header component
export const pkbMenu = {
  highlightItems: [
    { label: "PanKgraph", path: "https://pankgraph.org/" },
    {
      label: "Integrated Cell Browser",
      path: "https://pankbase.org/single-cell.html",
    },
  ],
  menuItems: [
    {
      label: "Data",
      path: "",
      subMenuItems: [
        {
          label: "Donor Summary",
          path: "https://pankbase.org/donor-metadata.html",
        },
        { label: "Data Library", path: "https://data.pankbase.org" },
        { label: "APIs", path: "https://pankbase.org/apis.html" },
      ],
    },
    {
      label: "Resources",
      path: "",
      subMenuItems: [
        {
          label: "Integrated Cell Browser",
          path: "https://pankbase.org/single-cell.html",
        },
        {
          label: "Analytical Library",
          path: "https://pankbase.org/analytical-library.html",
        },
        {
          label: "Publications",
          path: "https://pankbase.org/publications.html",
        },
      ],
    },
    {
      label: "About",
      path: "",
      subMenuItems: [
        { label: "Project", path: "https://pankbase.org/projects.html" },
        { label: "People", path: "https://pankbase.org/people.html" },
        { label: "Policies", path: "https://pankbase.org/policies.html" },
        { label: "Programs", path: "https://pankbase.org/programs.html" },
        { label: "Collaborate", path: "https://pankbase.org/collaborate.html" },
      ],
    },
    {
      label: "Help",
      path: "",
      subMenuItems: [
        { label: "Contact", path: "/contact.html" },
        {
          label: "Metadata | Data Standards",
          path: "https://pankbase.org/metadata-data-standards.html",
        },
        {
          label: "Tools | Pipelines",
          path: "https://pankbase.org/tools-pipelines.html",
        },
        { label: "Tutorials", path: "https://pankbase.org/tutorials.html" },
        { label: "News", path: "https://pankbase.org/news.html" },
      ],
    },
  ],
};

function PkbFooter() {
  return (
    <div className="pkb-footer">
      <div className="menu">
        <div className="main-menu-items">
          {pkbMenu.highlightItems.map((item, index) => (
            <div
              key={`footer-highlight-${index}`}
              className="menu-item-wrapper"
            >
              <Link href={item.path} className="menu-item menu-item-main">
                {item.label}
              </Link>
            </div>
          ))}
        </div>
        {pkbMenu.menuItems.map((item, index) => (
          <div key={`footer-menu-${index}`} className="menu-item-wrapper">
            <Link href={item.path || "#"} className="menu-item">
              {item.label}
            </Link>
            {item.subMenuItems && (
              <div className="submenu">
                {item.subMenuItems.map((subItem, subIndex) => (
                  <Link
                    key={`footer-submenu-${index}-${subIndex}`}
                    href={subItem.path || "#"}
                    className="submenu-item"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="f-row" style={{ gap: "20px" }}>
        <Link href="/">
          <Image
            width={37}
            height={37}
            style={{ height: "37px", width: "auto" }}
            src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black.svg"
            alt="PanKbase Logo"
          />
        </Link>
        <div>
          Supported by <strong>National Institutes of Health (NIH)</strong>{" "}
          grants <strong>U24 DK138515</strong>, <strong>U24 DK138512</strong>
          <br />
          Supplemental funds from the{" "}
          <strong>NIH Office of Data Science Strategies</strong>
        </div>
        <a
          href="https://hirnetwork.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            width={37}
            height={37}
            style={{ height: "37px", width: "auto" }}
            src="https://hugeampkpncms.org/sites/default/files/images/pankbase/logo-hirn.svg"
            alt="HIRN Logo"
          />
        </a>
      </div>
    </div>
  );
}

export default PkbFooter;
