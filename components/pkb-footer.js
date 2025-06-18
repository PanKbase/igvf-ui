import React from "react";
import Link from "next/link";
import Image from "next/image";

// Updated pkbMenu structure
export const pkbMenu = {
  highlightItems: [
    { label: "PanKgraph", path: "https://pankgraph.org/" },
    { label: "Integrated Cell Browser", path: "https://pankbase.org/single-cell.html" },
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
        { label: "Integrated Cell Browser", path: "https://pankbase.org/single-cell.html" },
        { label: "PCA Explorer", path: "https://dev.pankbase.org/pca-explorer.html" },
        { label: "Differential Gene Expression Browser", path: "https://pankbase.org/diff-exp.html" },
        {
          label: "Analytical Library",
          path: "https://pankbase.org/analytical-library.html",
        },
        {
          label: "Metadata Standards",
          path: "https://pankbase.org/metadata-data-standards.html",
        },
        { label: "Tools | Pipelines", path: "https://pankbase.org/tools-pipelines.html" },
        { label: "Publications", path: "https://pankbase.org/publications.html" },
      ],
    },
    {
      label: "About",
      path: "",
      subMenuItems: [
        { label: "Project", path: "https://pankbase.org/projects.html" },
        { label: "People", path: "https://pankbase.org/people.html" },
        { label: "Policies", path: "https://pankbase.org/policies.html" },
        { label: "Related Programs", path: "https://pankbase.org/programs.html" },
        { label: "Collaborate", path: "https://pankbase.org/collaborate.html" },
      ],
    },
    {
      label: "Help",
      path: "",
      subMenuItems: [
        { label: "Contact | Feedback", path: "https://pankbase.org/contact.html" },
        { label: "Tutorials", path: "https://pankbase.org/tutorials.html" },
        { label: "GitHub", path: "https://github.com/PanKbase" },
        { label: "News", path: "https://pankbase.org/news.html" },
      ],
    },
  ],
};

export default function PkbFooter() {
  return (
    <div className="pkb-footer">
      <div className="menu">
        <div className="main-menu-items">
          {pkbMenu.highlightItems.map((item, index) => (
            <div key={index} className="menu-item-wrapper">
              <a className="menu-item menu-item-main" href={item.path}>
                {item.label}
              </a>
            </div>
          ))}
        </div>
        {pkbMenu.menuItems.map((item, index) => (
          <div key={index} className="menu-item-wrapper">
            <a className="menu-item" href={item.path || null}>
              {item.label}
            </a>
            {item.subMenuItems && (
              <div className="submenu">
                {item.subMenuItems.map((subItem, subIndex) => (
                  <a
                    key={subIndex}
                    className="submenu-item"
                    href={subItem.path || null}
                  >
                    {subItem.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Social Media Icons Section - Exact match to Vue */}
      <div className="f-row align-v-center logos" style={{ gap: "10px" }}>
        <a href="https://x.com/PanKbase" target="_blank" title="@PanKbase" rel="noopener noreferrer">
          <Image
            width={20}
            height={20}
            src="https://hugeampkpncms.org/sites/default/files/images/logos/external/x-black.svg"
            alt="X (Twitter)"
          />
        </a>
        <a href="https://bsky.app/profile/pankbase.bsky.social" target="_blank" title="@pankbase.bsky.social" rel="noopener noreferrer">
          <Image
            width={20}
            height={20}
            src="https://hugeampkpncms.org/sites/default/files/images/logos/external/bluesky-black.svg"
            alt="Bluesky"
          />
        </a>
        <a href="https://www.linkedin.com/groups/13199008/" target="_blank" title="LinkedIn" rel="noopener noreferrer">
          <Image
            width={20}
            height={20}
            src="https://hugeampkpncms.org/sites/default/files/images/logos/external/linkedin-black.svg"
            alt="LinkedIn"
          />
        </a>
        <a href="https://github.com/PanKbase" target="_blank" title="GitHub" rel="noopener noreferrer">
          <Image
            width={20}
            height={20}
            src="https://hugeampkpncms.org/sites/default/files/images/logos/external/github-black.svg"
            alt="GitHub"
          />
        </a>
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
          Supported by <strong>National Institutes of Health (NIH)</strong> grants <strong>U24 DK138515</strong>, <strong>U24 DK138512</strong>
          <br />
          Supplemental funds from the <strong>NIH Office of Data Science Strategies</strong>
        </div>
        <a href="https://hirnetwork.org/" target="_blank" rel="noopener noreferrer">
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
