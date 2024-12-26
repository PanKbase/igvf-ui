import React, { useEffect } from 'react';

export default function Header() {

  useEffect(() => {
    injectFavicon(
      'https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/favicon-32x32.png'
    );
    injectFont(
      'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap'
    );
  }, []);

  const injectFavicon = (faviconUrl) => {
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      favicon.setAttribute('type', 'image/png');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', faviconUrl);
  };

  const injectFont = (fontUrl) => {
    const linkTag = document.createElement('link');
    linkTag.rel = 'stylesheet';
    linkTag.href = fontUrl;
    document.head.appendChild(linkTag);
  };

  return (
    <div className="pkb-nav">
      <div className="logo">
        <a href="/">
          <img
            src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/pkb-4.svg"
            alt="PanKbase Logo"
          />
        </a>
      </div>
      <div className="menu-wrapper">
        <div className="topmenu">
          <a className="topmenu-item" href="#">
            Search
            <img
              style={{ height: '15px', width: '15px' }}
              src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/search-icon.svg"
              alt="Search Icon"
            />
          </a>
          <a className="topmenu-item" href="#">Analysis</a>
          <a className="topmenu-item" href="#">
            Login
            <img
              style={{ height: '15px', width: '15px' }}
              src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/user-icon.svg"
              alt="User Icon"
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
              <a className="menu-item menu-item-main" href="/single-cell.html">
                Integrated Cell Browser
              </a>
            </div>
            <div className="menu-item-wrapper">
              <a
                className="menu-item menu-item-main"
                href="http://tools.cmdga.org:3838/metadata_analysis/"
              >
                Donor Metadata
              </a>
            </div>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item" href="#">Data</a>
            <div className="submenu">
              <a className="submenu-item" href="/data-browser.html">Data Browser</a>
              <a className="submenu-item" href="/single-cell.html">Integrated Cell Browser</a>
              <a className="submenu-item" href="http://tools.cmdga.org:3838/metadata_analysis/">
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
