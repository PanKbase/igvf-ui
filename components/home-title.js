import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteLogo from "./logo";
function injectFavicon(faviconUrl) {
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    favicon.setAttribute('type', 'image/png');
    document.head.appendChild(favicon);
  }
  favicon.setAttribute('href', faviconUrl);
}

function injectFont(fontUrl) {
  const linkTag = document.createElement('link');
  linkTag.rel = 'stylesheet';
  linkTag.href = fontUrl;
  document.head.appendChild(linkTag);
}

export default function Header() {
  useEffect(() => {
    injectFavicon(
      'https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/favicon-32x32.png'
    );
    injectFont(
      'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap'
    );
  }, []);

  return (
    <div className="pkb-nav">
      <div className="logo">
        <Link href="/">
          <SiteLogo />
        </Link>
      </div>
      <div className="menu-wrapper">
        <div className="topmenu">
          <a className="topmenu-item" href="#">
            Search
            <Image
              src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/search-icon.svg"
              alt="Search Icon"
              width={15}
              height={15}
            />
          </a>
          <a className="topmenu-item" href="#">Analysis</a>
          <a className="topmenu-item" href="#">
            Login
            <Image
              src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/user-icon.svg"
              alt="User Icon"
              width={15}
              height={15}
            />
          </a>
        </div>
        <div className="menu">
          <div className="main-menu-items">
            <div className="menu-item-wrapper">
              <a className="menu-item menu-item-main" href="https://dev.pankgraph.org/">
                PanKgraph
              </a>
            </div>
            <div className="menu-item-wrapper">
              <a
                className="menu-item menu-item-main"
                href="https://data.pankbase.org"
              >
                Data Library 
              </a>
            </div>
            <div className="menu-item-wrapper">
              <a className="menu-item menu-item-main" href="/single-cell.html">
                Integrated Cell Browser
              </a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Data</a>
            <div className="submenu">
              <a className="submenu-item" href="/data-browser.html">Data Browser</a>
              <a className="submenu-item" href="/single-cell.html">Integrated Cell Browser</a>
              <a className="submenu-item" href="https://data.pankbase.org/donor_metadata">
                Donor Metadata
              </a>
              <a className="submenu-item" href="/apis.html">APIs</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Resources</a>
            <div className="submenu">
              <a className="submenu-item" href="/analytical-library.html">Analytical Library</a>
              <a className="submenu-item" href="/publications.html">Publications</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">About</a>
            <div className="submenu">
              <a className="submenu-item" href="/projects.html">Project</a>
              <a className="submenu-item" href="/people.html">People</a>
              <a className="submenu-item" href="/policies.html">Policies</a>
              <a className="submenu-item" href="/programs.html">Programs</a>
              <a className="submenu-item" href="/collaborate.html">Collaborate</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Help</a>
            <div className="submenu">
              <a className="submenu-item" href="/contact.html">Contact</a>
              <a className="submenu-item" href="/metadata-data-standards.html">Metadata | Data Standards</a>
              <a className="submenu-item" href="/tools-pipelines.html">Tools | Pipelines</a>
              <a className="submenu-item" href="/tutorials.html">Tutorials</a>
              <a className="submenu-item" href="/news.html">News</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
