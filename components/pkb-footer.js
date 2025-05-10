import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Using the same pkbMenu structure from the header component
export const pkbMenu = {
    highlightItems: [
        { label: "PanKgraph", path: "https://pankgraph.org/" },
        { label: "Integrated Cell Browser", path: "/single-cell.html" },
    ],
    menuItems: [
        {
            label: "Data",
            path: "",
            subMenuItems: [
                {
                    label: "Donor Summary",
                    path: "/donor-metadata.html",
                },
                { label: "Data Library", path: "https://data.pankbase.org" },
                { label: "APIs", path: "/apis.html" },
            ],
        },
        {
            label: "Resources",
            path: "",
            subMenuItems: [
                { label: "Integrated Cell Browser", path: "/single-cell.html" },
                {
                    label: "Analytical Library",
                    path: "/analytical-library.html",
                },
                { label: "Publications", path: "/publications.html" },
            ],
        },
        {
            label: "About",
            path: "",
            subMenuItems: [
                { label: "Project", path: "/projects.html" },
                { label: "People", path: "/people.html" },
                { label: "Policies", path: "/policies.html" },
                { label: "Programs", path: "/programs.html" },
                { label: "Collaborate", path: "/collaborate.html" },
            ],
        },
        {
            label: "Help",
            path: "",
            subMenuItems: [
                { label: "Contact", path: "/contact.html" },
                {
                    label: "Metadata | Data Standards",
                    path: "/metadata-data-standards.html",
                },
                { label: "Tools | Pipelines", path: "/tools-pipelines.html" },
                { label: "Tutorials", path: "/tutorials.html" },
                { label: "News", path: "/news.html" },
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
            <div key={`footer-highlight-${index}`} className="menu-item-wrapper">
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
      
      <div className="f-row" style={{ gap: '20px' }}>
        <Link href="/">
          <Image
            width={37}
            height={37}
            style={{ height: '37px', width: 'auto' }}
            src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black.svg"
            alt="PanKbase Logo"
          />
        </Link>
        <div>
          Supported by <strong>National Institutes of Health (NIH)</strong> grants <strong>U24 DK138515</strong>, <strong>U24 DK138512</strong><br />
          Supplemental funds from the <strong>NIH Office of Data Science Strategies</strong>
        </div>
        <a href="https://hirnetwork.org/" target="_blank" rel="noopener noreferrer">
          <Image
            width={37}
            height={37}
            style={{ height: '37px', width: 'auto' }}
            src="https://hugeampkpncms.org/sites/default/files/images/pankbase/logo-hirn.svg"
            alt="HIRN Logo"
          />
        </a>
      </div>
    </div>
  );
}

export default PkbFooter;
