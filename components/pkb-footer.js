import React from 'react';
import Image from 'next/image';

const PkbFooter = () => {
  return (
    <div className="pkb-footer">
      <div className="menu">
        <div className="main-menu-items">
          <div className="menu-item-wrapper">
            <a className="menu-item menu-item-main" href="https://dev.pankgraph.org/">PanKgraph</a>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item menu-item-main" href="/single-cell.html">Integrated Cell Browser</a>
          </div>
          <div className="menu-item-wrapper">
            <a className="menu-item menu-item-main" href="http://tools.cmdga.org:3838/metadata_analysis/">Donor Metadata</a>
          </div>
        </div>
        <div className="menu-item-wrapper">
          <a className="menu-item" href="/">Data</a>
          <div className="submenu">
            <a className="submenu-item" href="/data-browser.html">Data Browser</a>
            <a className="submenu-item" href="/single-cell.html">Integrated Cell Browser</a>
            <a className="submenu-item" href="http://tools.cmdga.org:3838/metadata_analysis/">Donor Metadata</a>
            <a className="submenu-item" href="/apis.html">APIs</a>
          </div>
        </div>
        <div className="menu-item-wrapper">
          <a className="menu-item" href="/">Resources</a>
          <div className="submenu">
            <a className="submenu-item" href="/analytical-library.html">Analytical Library</a>
            <a className="submenu-item" href="/publications.html">Publications</a>
          </div>
        </div>
        <div className="menu-item-wrapper">
          <a className="menu-item" href="/">About</a>
          <div className="submenu">
            <a className="submenu-item" href="/projects.html">Project</a>
            <a className="submenu-item" href="/people.html">People</a>
            <a className="submenu-item" href="/policies.html">Policies</a>
            <a className="submenu-item" href="/programs.html">Programs</a>
            <a className="submenu-item" href="/collaborate.html">Collaborate</a>
          </div>
        </div>
        <div className="menu-item-wrapper">
          <a className="menu-item" href="/">Help</a>
          <div className="submenu">
            <a className="submenu-item" href="/contact.html">Contact</a>
            <a className="submenu-item" href="/metadata-data-standards.html">Metadata | Data Standards</a>
            <a className="submenu-item" href="/tools-pipelines.html">Tools | Pipelines</a>
            <a className="submenu-item" href="/tutorials.html">Tutorials</a>
            <a className="submenu-item" href="/news.html">News</a>
          </div>
        </div>
      </div>
      <div className="f-row" style={{ gap: '20px' }}>
        <div className="logo">
          <a href="/">
            <Image
              src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/pkb-4.svg"
              alt="PanKbase Logo"
              height={37}
              width={150}
            />
          </a>
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
};

export default PkbFooter;
