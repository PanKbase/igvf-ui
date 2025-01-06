// node_modules
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { XCircleIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
// lib
import {
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_ISSUER_BASE_DOMAIN,
  BRAND_COLOR,
  SITE_TITLE,
} from "../lib/constants";
import DarkModeManager from "../lib/dark-mode-manager";
// components
import Error from "../components/error";
//import NavigationSection from "../components/navigation";
import GlobalContext from "../components/global-context";
import HomeTitle from "../components/home-title";
import PkbFooter from "../components/pkb-footer";
import ScrollToTop from "../components/scroll-to-top";
import { Session } from "../components/session-context";
import ViewportOverlay from "../components/viewport-overlay";
// CSS
import "../styles/globals.css";
// import dynamic from "next/dynamic";

const testServerDomains = ["staging.pankbase.org", "localhost"];

function TestServerWarning() {
  const [isTestWarningVisible, setIsTestWarningVisible] = useState(false);

  useEffect(() => {
    const isTestingDomain = testServerDomains.includes(window.location.hostname);
    setIsTestWarningVisible(isTestingDomain);
  }, []);

  if (isTestWarningVisible) {
    return (
      <div className="flex justify-center gap-1 border-b border-red-700 bg-red-600 p-1 text-sm text-white dark:border-red-700 dark:bg-red-800 dark:text-gray-100">
        <div>
          This is the PanKbase Sandbox for testing submissions. All files submitted here will be deleted after 30 days.
        </div>
        <button onClick={() => setIsTestWarningVisible(false)} aria-label="Close sandbox warning banner">
          <XCircleIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }
}

function Site({ Component, pageProps, authentication }) {
  const [isLinkReloadEnabled, setIsLinkReloadEnabled] = useState(false);
  const { isLoading } = useAuth0();
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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
      </Head>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-E2PEXFFGYR" />
      <Script id="google-analytics-4-script">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-E2PEXFFGYR');
        `}
      </Script>
      <TestServerWarning />
      <HomeTitle />
      <div className="md:container">
      <div className="pkb-beta">
         beta
      </div>
        <ScrollToTop />
        <GlobalContext.Provider value={globalContext}>
          <Session authentication={authentication}>
            <div className="md:flex">
              <div className="min-w-0 shrink grow px-3 py-2 md:px-8">
                {pageProps.serverSideError ? (
                  <Error statusCode={pageProps.serverSideError.code} title={pageProps.serverSideError.description} />
                ) : (
                  <Component {...pageProps} />
                )}
              </div>
            </div>
          </Session>
        </GlobalContext.Provider>
      </div>
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
  const router = useRouter();

  function onRedirectCallback(appState) {
    if (appState?.returnTo) {
      router.replace(appState.returnTo);
    }
    setAuthTransitionPath(appState?.returnTo || "");
  }

  return (
    <Auth0Provider
      domain={AUTH0_ISSUER_BASE_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      onRedirectCallback={onRedirectCallback}
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" && window.location.origin,
        audience: AUTH0_AUDIENCE,
      }}
    >
      <Site {...props} authentication={{ authTransitionPath, setAuthTransitionPath }} />
    </Auth0Provider>
  );
}
