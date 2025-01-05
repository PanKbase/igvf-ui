import React from 'react';
import Link from 'next/link';

function PkbFooter() {
  return (
    <div className="pkb-footer">
      <div className="menu-footer">
        <div className="main-menu-items">
          <div className="menu-item-wrapper-footer">
            <Link href="https://dev.pankgraph.org/" className="menu-item menu-item-main">
              PanKgraph
            </Link>
          </div>
          <div className="menu-item-wrapper-footer">
            <Link href="https://data.pankbase.org" className="menu-item menu-item-main">
              Data Library
            </Link>
          </div>
          <div className="menu-item-wrapper-footer">
            <Link href="/single-cell.html" className="menu-item menu-item-main">
              Integrated Cell Browser
            </Link>
          </div>
        </div>
        <div className="menu-item-wrapper-footer">
          <Link href="/" className="menu-item">
            Data
          </Link>
          <div className="submenu-footer">
            <Link href="/data-browser.html" className="submenu-item-footer">Data Browser</Link>
            <Link href="http://tools.cmdga.org:3838/metadata_analysis/" className="submenu-item-footer">Donor Metadata</Link>
            <Link href="/apis.html" className="submenu-item-footer">APIs</Link>
          </div>
        </div>
        <div className="menu-item-wrapper-footer">
          <Link href="/" className="menu-item">
            Resources
          </Link>
          <div className="submenu-footer">
            <Link href="/single-cell.html" className="submenu-item-footer">Integrated Cell Browser</Link>
            <Link href="/analytical-library.html" className="submenu-item-footer">Analytical Library</Link>
            <Link href="/publications.html" className="submenu-item-footer">Publications</Link>
          </div>
        </div>
        <div className="menu-item-wrapper-footer">
          <Link href="/" className="menu-item">
            About
          </Link>
          <div className="submenu-footer">
            <Link href="/projects.html" className="submenu-item-footer">Project</Link>
            <Link href="/people.html" className="submenu-item-footer">People</Link>
            <Link href="/policies.html" className="submenu-item-footer">Policies</Link>
            <Link href="/programs.html" className="submenu-item-footer">Programs</Link>
            <Link href="/collaborate.html" className="submenu-item-footer">Collaborate</Link>
          </div>
        </div>
        <div className="menu-item-wrapper-footer">
          <Link href="/" className="menu-item">
            Help
          </Link>
          <div className="submenu-footer">
            <Link href="/contact.html" className="submenu-item-footer">Contact</Link>
            <Link href="/metadata-data-standards.html" className="submenu-item-footer">Metadata | Data Standards</Link>
            <Link href="/tools-pipelines.html" className="submenu-item-footer">Tools | Pipelines</Link>
            <Link href="/tutorials.html" className="submenu-item-footer">Tutorials</Link>
            <Link href="/news.html" className="submenu-item-footer">News</Link>
          </div>
        </div>
      </div>
      <div className="f-row" style={{ gap: '20px' }}>
        <div className="logo">
          <Link href="/">
            <img style={{ height: '37px' }} src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black.svg" alt="PanKbase Logo" />
          </Link>
        </div>
        <div>
          Supported by <strong>National Institutes of Health (NIH)</strong> grants <strong>U24 DK138515</strong>, <strong>U24 DK138512</strong><br />
          Supplemental funds from the <strong>NIH Office of Data Science Strategies</strong>
        </div>
      </div>
    </div>
  );
}

export default PkbFooter;
