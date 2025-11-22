// node_modules
import { XCircleIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import Script from "next/script";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
// lib
import {
  GOOGLE_OAUTH_CLIENT_ID,
  BRAND_COLOR,
  SITE_TITLE,
} from "../lib/constants";
// components
import { GoogleOAuthProvider, useGoogleAuth } from "../components/google-oauth-context";
import DarkModeManager from "../lib/dark-mode-manager";
// components
import Error from "../components/error";
//import NavigationSection from "../components/navigation";
import GlobalContext from "../components/global-context";
import HomeTitle from "../components/home-title";
import PkbFooter from "../components/pkb-footer";
import { Session } from "../components/session-context";
import ViewportOverlay from "../components/viewport-overlay";
// CSS
import "../styles/globals.css";
// import dynamic from "next/dynamic";

const testServerDomains = ["staging.pankbase.org", "localhost"];

function TestServerWarning() {
  const [isTestWarningVisible, setIsTestWarningVisible] = useState(false);

  useEffect(() => {
    const isTestingDomain = testServerDomains.includes(
      window.location.hostname
    );
    setIsTestWarningVisible(isTestingDomain);
  }, []);

  if (isTestWarningVisible) {
    return (
      <div className="flex justify-center gap-1 border-b border-red-700 bg-red-600 p-1 text-sm text-white dark:border-red-700 dark:bg-red-800 dark:text-gray-100">
        <div>
          This is the PanKbase Sandbox for testing submissions. All files
          submitted here will be deleted after 30 days.
        </div>
        <button
          onClick={() => setIsTestWarningVisible(false)}
          aria-label="Close sandbox warning banner"
        >
          <XCircleIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }
}

function Site({ Component, pageProps, authentication }) {
  const [isLinkReloadEnabled, setIsLinkReloadEnabled] = useState(false);
  const { isLoading } = useGoogleAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeManager = new DarkModeManager(setIsDarkMode);
    darkModeManager.installDarkModeListener();
    darkModeManager.setCurrentDarkMode();
    return () => {
      darkModeManager.removeDarkModeListener();
    };
  }, []);

  const globalContext = useMemo(() => {
    return {
      site: { title: SITE_TITLE },
      page: {
        title: pageProps.pageContext?.title || "",
        type: pageProps.pageContext?.type || "",
      },
      breadcrumbs: pageProps.breadcrumbs || [],
      linkReload: {
        isEnabled: isLinkReloadEnabled,
        setIsEnabled: setIsLinkReloadEnabled,
      },
      darkMode: { enabled: isDarkMode },
    };
  }, [
    pageProps.breadcrumbs,
    pageProps.pageContext?.title,
    pageProps.pageContext?.type,
    isLinkReloadEnabled,
    isDarkMode,
  ]);

  return (
    <ViewportOverlay isEnabled={isLoading}>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content="Portal for the PanKbase consortium" />
        <meta name="theme-color" content={BRAND_COLOR} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
      </Head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-XYBYEW53TS"
        strategy="afterInteractive"
        onError={(e) => {
          console.warn("Failed to load Google Tag Manager script:", e);
        }}
      />
      <Script id="google-analytics-4-script" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XYBYEW53TS');
        `}
      </Script>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        async
        defer
        onLoad={() => {
          console.log("Google Identity Services script loaded successfully");
        }}
        onError={(e) => {
          console.warn("Failed to load Google Identity Services script via Next.js Script:", e);
          // The component will handle loading it via dynamic script tag as fallback
        }}
      />
      <TestServerWarning />
      <GlobalContext.Provider value={globalContext}>
        <Session authentication={authentication}>
          <HomeTitle />
          <div className="md:container">
            <div className="md:flex">
              <div className="min-w-0 shrink grow px-3 py-2 md:px-8">
                {pageProps.serverSideError ? (
                  <Error
                    statusCode={pageProps.serverSideError.code}
                    title={pageProps.serverSideError.description}
                  />
                ) : (
                  <Component {...pageProps} />
                )}
              </div>
            </div>
          </div>
        </Session>
      </GlobalContext.Provider>
      <PkbFooter />
    </ViewportOverlay>
  );
}

Site.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
  authentication: PropTypes.exact({
    authTransitionPath: PropTypes.string.isRequired,
    setAuthTransitionPath: PropTypes.func.isRequired,
  }).isRequired,
};

export default function App(props) {
  const [authTransitionPath, setAuthTransitionPath] = useState("");

  if (!GOOGLE_OAUTH_CLIENT_ID) {
    console.error("GOOGLE_OAUTH_CLIENT_ID is not set. Please configure it in environment variables or constants.ts");
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <Site
        {...props}
        authentication={{ authTransitionPath, setAuthTransitionPath }}
      />
    </GoogleOAuthProvider>
  );
}
