import React, { useEffect } from 'react';
import Link from 'next/link';
import SiteLogo from "./logo";
import NavigationSection from "../components/navigation";
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
  if (typeof window !== "undefined") {
    injectFavicon(
      'https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/favicon-32x32.png'
    );
    injectFont(
      'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap'
    );
  }
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
          <a className="topmenu-item" href="https://data.pankbase.org">Data Library Home</a>
          <a className="topmenu-item" href="https://data.pankbase.org/profiles">Data Library Schema</a>
          <NavigationSection />
        </div>
        <div className="menu">
          <div className="menu-item-wrapper">
            <a className="menu-item menu-item-main" href="https://pankgraph.org" target="_blank" rel="noopener noreferrer">
              PanKgraph
            </a>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item menu-item-main" href="https://pankbase.org:8000/single-cell.html" target="_blank" rel="noopener noreferrer">
              Integrated Cell Browser
            </a>
          </div>
          <span className="menu-separator">|</span>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Data</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org/donor-metadata.html" target="_blank" rel="noopener noreferrer">Donor Summary</a>
              <a className="submenu-item" href="https://data.pankbase.org" target="_blank" rel="noopener noreferrer">Data Library</a>
              <a className="submenu-item" href="https://pankbase.org/apis.html" target="_blank" rel="noopener noreferrer">APIs</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Resources</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org/single-cell.html" target="_blank" rel="noopener noreferrer">Integrated Cell Browser</a>
              <a className="submenu-item" href="https://pankbase.org/analytical-library.html" target="_blank" rel="noopener noreferrer">Analytical Library</a>
              <a className="submenu-item" href="https://pankbase.org/publications.html" target="_blank" rel="noopener noreferrer">Publications</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">About</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org/projects.html" target="_blank" rel="noopener noreferrer">Project</a>
              <a className="submenu-item" href="https://pankbase.org/people.html" target="_blank" rel="noopener noreferrer">People</a>
              <a className="submenu-item" href="https://pankbase.org/policies.html" target="_blank" rel="noopener noreferrer">Policies</a>
              <a className="submenu-item" href="https://pankbase.org/programs.html" target="_blank" rel="noopener noreferrer">Programs</a>
              <a className="submenu-item" href="https://pankbase.org/collaborate.html" target="_blank" rel="noopener noreferrer">Collaborate</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Help</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org/contact.html" target="_blank" rel="noopener noreferrer">Contact</a>
              <a className="submenu-item" href="https://pankbase.org/metadata-data-standards.html" target="_blank" rel="noopener noreferrer">Metadata | Data Standards</a>
              <a className="submenu-item" href="https://pankbase.org/tools-pipelines.html" target="_blank" rel="noopener noreferrer">Tools | Pipelines</a>
              <a className="submenu-item" href="https://pankbase.org/tutorials.html" target="_blank" rel="noopener noreferrer">Tutorials</a>
              <a className="submenu-item" href="https://pankbase.org/news.html" target="_blank" rel="noopener noreferrer">News</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
