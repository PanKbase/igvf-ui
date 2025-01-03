import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteLogo from "./logo";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./form-elements";
import Modal from "./modal";
import SessionContext from "./session-context";

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
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const { setAuthStageLogin, setAuthStageLogout } = useContext(SessionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    injectFavicon(
      'https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/favicon-32x32.png'
    );
    injectFont(
      'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap'
    );
  }, []);

  function function handleSignOut() {
    logout();
    setAuthStageLogout();
    setIsModalOpen(false);
  }

  function function handleSignIn() {
    loginWithRedirect();
    setAuthStageLogin();
  }

  return (
    <div className="pkb-nav">
      <div className="logo">
        <Link href="/">
          <SiteLogo />
        </Link>
      </div>
      <div className="menu-wrapper">
        <div className="topmenu">
          <a className="topmenu-item" href="#">Data Library Schema</a>
          <div className="topmenu-item">
            {isAuthenticated ? (
              <button onClick={() => setIsModalOpen(true)} className="flex items-center">
                Sign Out
                <Image
                  src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/user-icon.svg"
                  alt="User Icon"
                  width={15}
                  height={15}
                />
              </button>
            ) : (
              <button onClick={handleSignIn} className="flex items-center">
                Data Library Login
                <Image
                  src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/user-icon.svg"
                  alt="User Icon"
                  width={15}
                  height={15}
                />
              </button>
            )}
          </div>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header closeLabel="Cancel">
          <h2 className="text-lg font-semibold">Sign Out</h2>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to sign out?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsModalOpen(false)} label="Cancel">Cancel</Button>
          <Button onClick={handleSignOut} label="Sign Out">Sign Out</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
