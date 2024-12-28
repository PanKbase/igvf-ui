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
              <a className="menu-item menu-item-main" href="https://pankbase.org:8000/single-cell.html">
                Integrated Cell Browser
              </a>
            </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Data</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org:8000/data-browser.html">Data Browser</a>
              <a className="submenu-item" href="https://pankbase.org:8000/single-cell.html">Integrated Cell Browser</a>
              <a className="submenu-item" href="https://data.pankbase.org/donor_metadata">
                Donor Metadata
              </a>
              <a className="submenu-item" href="https://pankbase.org:8000/apis.html">APIs</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Resources</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org:8000/analytical-library.html">Analytical Library</a>
              <a className="submenu-item" href="https://pankbase.org:8000/publications.html">Publications</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">About</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org:8000/projects.html">Project</a>
              <a className="submenu-item" href="https://pankbase.org:8000/people.html">People</a>
              <a className="submenu-item" href="https://pankbase.org:8000/policies.html">Policies</a>
              <a className="submenu-item" href="https://pankbase.org:8000/programs.html">Programs</a>
              <a className="submenu-item" href="https://pankbase.org:8000/collaborate.html">Collaborate</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Help</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org:8000/contact.html">Contact</a>
              <a className="submenu-item" href="https://pankbase.org:8000/metadata-data-standards.html">Metadata | Data Standards</a>
              <a className="submenu-item" href="https://pankbase.org:8000/tools-pipelines.html">Tools | Pipelines</a>
              <a className="submenu-item" href="https://pankbase.org:8000/tutorials.html">Tutorials</a>
              <a className="submenu-item" href="https://pankbase.org:8000/news.html">News</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
