import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function PkbFooter() {
  return (
    <div className="pkb-footer">
      <div className="menu">
        <div className="main-menu-items">
          <div className="menu-item-wrapper">
            <Link href="https://dev.pankgraph.org/" className="menu-item menu-item-main">
              PanKgraph
            </Link>
          </div>
          <div className="menu-item-wrapper">
            <Link href="/single-cell.html" className="menu-item menu-item-main">
              Integrated Cell Browser
            </Link>
          </div>
          <div className="menu-item-wrapper">
            <Link href="http://tools.cmdga.org:3838/metadata_analysis/" className="menu-item menu-item-main">
              Donor Metadata
            </Link>
          </div>
        </div>
        <div className="menu-item-wrapper">
          <Link href="/" className="menu-item">
            Data
          </Link>
          <div className="submenu">
            <Link href="/data-browser.html" className="submenu-item">Data Browser</Link>
            <Link href="/single-cell.html" className="submenu-item">Integrated Cell Browser</Link>
            <Link href="http://tools.cmdga.org:3838/metadata_analysis/" className="submenu-item">Donor Metadata</Link>
            <Link href="/apis.html" className="submenu-item">APIs</Link>
          </div>
        </div>
        <div className="menu-item-wrapper">
          <Link href="/" className="menu-item">
            Resources
          </Link>
          <div className="submenu">
            <Link href="/analytical-library.html" className="submenu-item">Analytical Library</Link>
            <Link href="/publications.html" className="submenu-item">Publications</Link>
          </div>
        </div>
        <div className="menu-item-wrapper">
          <Link href="/" className="menu-item">
            About
          </Link>
          <div className="submenu">
            <Link href="/projects.html" className="submenu-item">Project</Link>
            <Link href="/people.html" className="submenu-item">People</Link>
            <Link href="/policies.html" className="submenu-item">Policies</Link>
            <Link href="/programs.html" className="submenu-item">Programs</Link>
            <Link href="/collaborate.html" className="submenu-item">Collaborate</Link>
          </div>
        </div>
        <div className="menu-item-wrapper">
          <Link href="/" className="menu-item">
            Help
          </Link>
          <div className="submenu">
            <Link href="/contact.html" className="submenu-item">Contact</Link>
            <Link href="/metadata-data-standards.html" className="submenu-item">Metadata | Data Standards</Link>
            <Link href="/tools-pipelines.html" className="submenu-item">Tools | Pipelines</Link>
            <Link href="/tutorials.html" className="submenu-item">Tutorials</Link>
            <Link href="/news.html" className="submenu-item">News</Link>
          </div>
        </div>
      </div>
      <div className="f-row" style={{ gap: '20px' }}>
        <div className="logo">
          <Link href="/">
            <Image
              src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/pkb-4.svg"
              alt="PanKbase Logo"
              height={37}
              width={150}
            />
          </Link>
        </div>
        <div>
          Supported by <strong>National Institutes of Health (NIH)</strong> grants <strong>U24 DK138515</strong>, <strong>U24 DK138512</strong><br />
          Supplemental funds from the <strong>NIH Office of Data Science Strategies</strong>
        </div>
      </div>

      <style jsx>{`
        .pkb-footer {
          width: 100%;
          background: #fafafa;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 40px 20px;
          border-top: 3px solid var(--pkb-primary-green);
          box-shadow: 0px 2px 10px var(--pkb-primary-green);
          min-height: 70px;
          margin-top: auto;
          flex-direction: column;
          gap: 40px;
        }
        .menu {
          display: flex;
          gap: 20px;
        }
        .menu a, .menu a:visited {
          color: black !important;
        }
        .menu a:hover {
          color: var(--pkb-secondary-green) !important;
          text-decoration: none;
        }
        .menu-item-wrapper {
          display: flex;
          flex-direction: column;
        }
        .submenu {
          display: flex;
          flex-direction: column;
        }
        a.submenu-item {
          font-weight: normal;
        }
      `}</style>
    </div>
  );
}

export default PkbFooter;
