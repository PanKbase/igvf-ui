import React, { useEffect } from 'react';
import Link from 'next/link';
import SiteLogo from "./logo";
import dynamic from "next/dynamic";
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
// Dynamically import NavigationSection without SSR
const NavigationSection = dynamic(() => import("../components/navigation"), {
  ssr: false,
});

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
          <a className="topmenu-item" href="https://data.pankbase.org/profiles">Data Library Schema</a>
        <NavigationSection />
        </div>
        <div className="menu">
          <div className="menu-item-wrapper">
            <a className="menu-item menu-item-main" href="https://dev.pankgraph.org/" target="_blank" rel="noopener noreferrer">
              PanKgraph
            </a>
          </div>
          <div className="menu-item-wrapper">
            <a
              className="menu-item menu-item-main"
              href="https://data.pankbase.org"
            target="_blank" rel="noopener noreferrer">
              Data Library
            </a>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item menu-item-main" href="https://pankbase.org:8000/single-cell.html" target="_blank" rel="noopener noreferrer">
              Integrated Cell Browser
            </a>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Data</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org:8000/data-browser.html" target="_blank" rel="noopener noreferrer">Data Browser</a>
              <a className="submenu-item" href="http://tools.cmdga.org:3838/metadata_analysis_assays/" target="_blank" rel="noopener noreferrer">Donor Metadata</a>
              <a className="submenu-item" href="https://pankbase.org:8000/apis.html" target="_blank" rel="noopener noreferrer">APIs</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Resources</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org:8000/single-cell.html" target="_blank" rel="noopener noreferrer">Integrated Cell Browser</a>
              <a className="submenu-item" href="https://pankbase.org:8000/analytical-library.html" target="_blank" rel="noopener noreferrer">Analytical Library</a>
              <a className="submenu-item" href="https://pankbase.org:8000/publications.html" target="_blank" rel="noopener noreferrer">Publications</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">About</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org:8000/projects.html" target="_blank" rel="noopener noreferrer">Project</a>
              <a className="submenu-item" href="https://pankbase.org:8000/people.html" target="_blank" rel="noopener noreferrer">People</a>
              <a className="submenu-item" href="https://pankbase.org:8000/policies.html" target="_blank" rel="noopener noreferrer">Policies</a>
              <a className="submenu-item" href="https://pankbase.org:8000/programs.html" target="_blank" rel="noopener noreferrer">Programs</a>
              <a className="submenu-item" href="https://pankbase.org:8000/collaborate.html" target="_blank" rel="noopener noreferrer">Collaborate</a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Help</a>
            <div className="submenu">
              <a className="submenu-item" href="https://pankbase.org:8000/contact.html" target="_blank" rel="noopener noreferrer">Contact</a>
              <a className="submenu-item" href="https://pankbase.org:8000/metadata-data-standards.html" target="_blank" rel="noopener noreferrer">Metadata | Data Standards</a>
              <a className="submenu-item" href="https://pankbase.org:8000/tools-pipelines.html" target="_blank" rel="noopener noreferrer">Tools | Pipelines</a>
              <a className="submenu-item" href="https://pankbase.org:8000/tutorials.html" target="_blank" rel="noopener noreferrer">Tutorials</a>
              <a className="submenu-item" href="https://pankbase.org:8000/news.html" target="_blank" rel="noopener noreferrer">News</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
