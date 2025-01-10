import React from 'react';
import Link from 'next/link';

function PkbFooter() {
  return (
      <div className="pkb-footer" style={{ display: 'flex', flexDirection: "column" }}>
      <div className="menu-footer">
        <div className="main-menu-items">
          <div className="menu-item-wrapper-footer">
            <Link href="https://pankgraph.org/" className="menu-item menu-item-main">
              PanKgraph
            </Link>
          </div>
          <div className="menu-item-wrapper-footer">
            <Link href="https://pankbase.org/single-cell.html" className="menu-item menu-item-main">
              Integrated Cell Browser
            </Link>
          </div>
        </div>
        <div className="menu-item-wrapper-footer">
          <Link href="/" className="menu-item">
            Data
          </Link>
          <div className="submenu-footer">
            <Link href="https://pankbase.org/donor-metadata.html" className="submenu-item-footer">Donor Summary</Link>
            <Link href="https://data.pankbase.org" className="submenu-item-footer">Data Library</Link>
            <Link href="https://pankbase.org/apis.html" className="submenu-item-footer">APIs</Link>
          </div>
        </div>
        <div className="menu-item-wrapper-footer">
          <Link href="/" className="menu-item">
            Resources
          </Link>
          <div className="submenu-footer">
            <Link href="https://pankbase.org/single-cell.html" className="submenu-item-footer">Integrated Cell Browser</Link>
            <Link href="https://pankbase.org/analytical-library.html" className="submenu-item-footer">Analytical Library</Link>
            <Link href="https://pankbase.org/publications.html" className="submenu-item-footer">Publications</Link>
          </div>
        </div>
        <div className="menu-item-wrapper-footer">
          <Link href="/" className="menu-item">
            About
          </Link>
          <div className="submenu-footer">
            <Link href="https://pankbase.org/projects.html" className="submenu-item-footer">Project</Link>
            <Link href="https://pankbase.org/people.html" className="submenu-item-footer">People</Link>
            <Link href="https://pankbase.org/policies.html" className="submenu-item-footer">Policies</Link>
            <Link href="https://pankbase.org/programs.html" className="submenu-item-footer">Programs</Link>
            <Link href="https://pankbase.org/collaborate.html" className="submenu-item-footer">Collaborate</Link>
          </div>
        </div>
        <div className="menu-item-wrapper-footer">
          <Link href="/" className="menu-item">
            Help
          </Link>
          <div className="submenu-footer">
            <Link href="https://pankbase.org/contact.html" className="submenu-item-footer">Contact</Link>
            <Link href="https://pankbase.org/metadata-data-standards.html" className="submenu-item-footer">Metadata | Data Standards</Link>
            <Link href="https://pankbase.org/tools-pipelines.html" className="submenu-item-footer">Tools | Pipelines</Link>
            <Link href="https://pankbase.org/tutorials.html" className="submenu-item-footer">Tutorials</Link>
            <Link href="https://pankbase.org/news.html" className="submenu-item-footer">News</Link>
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
