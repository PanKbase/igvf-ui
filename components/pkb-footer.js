import React from "react";

// Updated pkbMenu structure
export const pkbMenu = {
  highlightItems: [
    { label: "PanKgraph", path: "https://pankgraph.org/" },
    { label: "Integrated Cell Browser", path: "https://dev.pankbase.org/single-cell.html" }
  ],
  menuItems: [
    {
      label: "Data",
      path: "",
      subMenuItems: [
        {
          label: "Donor Summary",
          path: "https://dev.pankbase.org/donor-metadata.html",
        },
        { label: "Data Library", path: "https://data.pankbase.org" },
        { label: "APIs", path: "https://dev.pankbase.org/apis.html" },
      ],
    },
    {
      label: "Resources",
      path: "",
      subMenuItems: [
        { label: "Integrated Cell Browser", path: "https://dev.pankbase.org/single-cell.html" },
        { label: "Differential Gene Expression Browser", path: "https://dev.pankbase.org/diff-exp.html" },
        {
          label: "Analytical Library",
          path: "https://dev.pankbase.org/analytical-library.html",
        },
        {
          label: "Metadata Standards",
          path: "https://dev.pankbase.org/metadata-data-standards.html",
        },
        { label: "Tools | Pipelines", path: "https://dev.pankbase.org/tools-pipelines.html" },
        { label: "Publications", path: "https://dev.pankbase.org/publications.html" },
      ],
    },
    {
      label: "About",
      path: "",
      subMenuItems: [
        { label: "Project", path: "https://dev.pankbase.org/projects.html" },
        { label: "People", path: "https://dev.pankbase.org/people.html" },
        { label: "Policies", path: "https://dev.pankbase.org/policies.html" },
        { label: "Programs", path: "https://dev.pankbase.org/programs.html" },
        { label: "Collaborate", path: "https://dev.pankbase.org/collaborate.html" },
      ],
    },
    {
      label: "Help",
      path: "",
      subMenuItems: [
        { label: "Contact | Feedback", path: "https://dev.pankbase.org/contact.html" },
        { label: "Tutorials", path: "https://dev.pankbase.org/tutorials.html" },
        { label: "GitHub", path: "https://github.com/PanKbase"},
        { label: "News", path: "https://dev.pankbase.org/news.html" },
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
        <a href="https://x.com/PanKbase" target="_blank" title="@PanKbase">
          <img src="https://hugeampkpncms.org/sites/default/files/images/logos/external/x-black.svg" alt="X (Twitter)" />
        </a>
        <a href="https://bsky.app/profile/pankbase.bsky.social" target="_blank" title="@pankbase.bsky.social">
          <img src="https://hugeampkpncms.org/sites/default/files/images/logos/external/bluesky-black.svg" alt="Bluesky" />
        </a>
        <a href="https://www.linkedin.com/groups/13199008/" target="_blank" title="LinkedIn">
          <img src="https://hugeampkpncms.org/sites/default/files/images/logos/external/linkedin-black.svg" alt="LinkedIn" />
        </a>
        <a href="https://github.com/PanKbase" target="_blank" title="GitHub">
          <img src="https://hugeampkpncms.org/sites/default/files/images/logos/external/github-black.svg" alt="GitHub" />
        </a>
      </div>
      
      <div className="f-row" style={{ gap: "20px" }}>
        <a href="/">
          <img 
            style={{ height: "37px" }} 
            src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black.svg"
            alt="PanKbase Logo"
          />
        </a>
        <div>
          Supported by <strong>National Institutes of Health (NIH)</strong> grants <strong>U24 DK138515</strong>, <strong>U24 DK138512</strong>
          <br />
          Supplemental funds from the <strong>NIH Office of Data Science Strategies</strong>
        </div>
        <a href="https://hirnetwork.org/" target="_blank">
          <img 
            style={{ height: "37px" }} 
            src="https://hugeampkpncms.org/sites/default/files/images/pankbase/logo-hirn.svg" 
            alt="HIRN Logo"
          />
        </a>
      </div>
    </div>
  );
}
