import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteLogo from "./logo";
import { useAuth0 } from "@auth0/auth0-react";
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
          <a className="topmenu-item" href="#">Data Library Schema</a>
          <div className="topmenu-item">
            {isAuthenticated ? (
              <button onClick={() => logout()} className="flex items-center">
                Sign Out
                <Image
                  src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/user-icon.svg"
                  alt="User Icon"
                  width={15}
                  height={15}
                />
              </button>
            ) : (
              <button onClick={() => loginWithRedirect()} className="flex items-center">
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
        </div>
      </div>
    </div>
  );
}
