import React from 'react';
import Link from 'next/link';
import SiteLogo from "./logo";
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
            <Link href="/single-cell.html" className="menu-item menu-item-main">
              Integrated Cell Browser
            </Link>
          </div>
          <div className="menu-item-wrapper-footer">
            <Link href="http://tools.cmdga.org:3838/metadata_analysis/" className="menu-item menu-item-main">
              Donor Metadata
            </Link>
          </div>
        </div>
        <div className="menu-item-wrapper-footer">
          <Link href="/" className="menu-item">
            Data
          </Link>
          <div className="submenu-footer">
            <Link href="/data-browser.html" className="submenu-item">Data Browser</Link>
            <Link href="/single-cell.html" className="submenu-item">Integrated Cell Browser</Link>
            <Link href="http://tools.cmdga.org:3838/metadata_analysis/" className="submenu-item">Donor Metadata</Link>
            <Link href="/apis.html" className="submenu-item">APIs</Link>
          </div>
        </div>
        <div className="menu-item-wrapper-footer">
          <Link href="/" className="menu-item">
            Resources
          </Link>
          <div className="submenu-footer">
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
    </div>
  );
}

export default PkbFooter;
