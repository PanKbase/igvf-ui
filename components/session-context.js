/**
 * Establishes the context to hold the back-end session and session-properties records for
 * the currently logged-in user. You have to do this within the <Auth0Provider> component so that
 * we can get the current Auth0 login state. The session record has only a random CSFR token while
 * logged out from the server. While logged in, it also has auth.userid with your email address.
 *
 * This module also handles signing the user into igvfd after a successful sign in to Auth0.
 */

// node_modules
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { createContext, useEffect, useRef, useState } from "react";
// lib
import {
  getDataProviderUrl,
  getSession,
  getSessionProperties,
  goToAuthError,
  loginDataProvider,
  logoutAuthProvider,
  logoutDataProvider,
} from "../lib/authentication";
import getCollectionTitles from "../lib/collection-titles";
import { getProfiles } from "../lib/profiles";
/* istanbul ignore file */

/**
 * Establishes the context to hold the back-end session record for the currently signed-in user.
 * Other modules needing the session record can get it from this context.
 */
const SessionContext = createContext({
  session: {},
});

export default SessionContext;

/**
 * This context provider reacts to the user logging in or out of Auth0 by then logging in or out of
 * igvfd. It also provides other useful data retrieved from the server at page load so that child
 * modules don't need to request them again.
 *
 * This only gets used in the <App> component to encapsulate the session context. Place this within
 * the <Auth0Provider> context so that <Session> can access the current authentication state.
 */
export function Session({ postLoginRedirectUri = "", children }) {
  // Caches the back-end session object
  const [session, setSession] = useState(null);
  // Caches the session-properties object
  const [sessionProperties, setSessionProperties] = useState(null);
  // Caches the /profiles schemas
  const [profiles, setProfiles] = useState(null);
  // Caches the /collection-titles map
  const [collectionTitles, setCollectionTitles] = useState(null);
  // Caches the data provider URL
  const [dataProviderUrl, setDataProviderUrl] = useState(null);
  const loginInFlight = useRef(false);

  const { getAccessTokenSilently, isAuthenticated, isLoading, logout } =
    useAuth0();
  const router = useRouter();

  // Get the data provider URL in case the user loaded a page that 404'd, in which case NextJS
  // doesn't load environment variables, leaving us unable to retrieve the session and session-
  // properties objects from igvfd. By getting the data provider URL, we can then get the session
  // and session-properties objects using the full URL instead of just the path.
  useEffect(() => {
    if (!dataProviderUrl) {
      getDataProviderUrl().then((url) => {
        setDataProviderUrl(url);
      });
    }
  }, [dataProviderUrl]);

  // Get the session object from igvfd if we don't already have it in state. We need this to get
  // the CSRF token to sign into igvfd.
  useEffect(() => {
    if (!session && dataProviderUrl) {
      getSession(dataProviderUrl).then((sessionResponse) => {
        setSession(sessionResponse);
      });
    }
  }, [dataProviderUrl, session]);

  // Get the session-properties object from igvfd if we don't already have it in state. This gives
  // us the user's name and email address, and whether they're an admin.
  useEffect(() => {
    if (!sessionProperties && dataProviderUrl) {
      getSessionProperties(dataProviderUrl).then(
        (sessionPropertiesResponse) => {
          setSessionProperties(sessionPropertiesResponse);
        }
      );
    }
  }, [dataProviderUrl, sessionProperties]);

  // Get all the schemas so that the several other places in the code that need schemas can get
  // them from this context instead of doing a request to /profiles.
  useEffect(() => {
    if (!profiles && dataProviderUrl) {
      getProfiles(dataProviderUrl).then((response) => {
        setProfiles(response);
      });
    }
  }, [profiles, dataProviderUrl]);

  // Get the mapping of @type, collection name, and schema name to corresponding human-readable
  // names.
  useEffect(() => {
    if (!collectionTitles && dataProviderUrl) {
      getCollectionTitles(dataProviderUrl).then((response) => {
        setCollectionTitles(response);
      });
    }
  }, [collectionTitles, dataProviderUrl]);

  useEffect(() => {
    if (!isAuthenticated) {
      loginInFlight.current = false;
    }
  }, [isAuthenticated]);

  // If Auth0 reports the user is signed in and igvfd does not yet have auth.userid, log them in.
  useEffect(() => {
    if (
      isAuthenticated &&
      session &&
      !session["auth.userid"] &&
      dataProviderUrl &&
      !loginInFlight.current
    ) {
      loginInFlight.current = true;
      loginDataProvider(session, getAccessTokenSilently)
        .then((sessionPropertiesResponse) => {
          const isError =
            !sessionPropertiesResponse ||
            sessionPropertiesResponse.status === "error" ||
            sessionPropertiesResponse.isError === true ||
            (sessionPropertiesResponse.code &&
              sessionPropertiesResponse.code >= 400);

          if (isError) {
            const reason =
              sessionPropertiesResponse?.description ||
              sessionPropertiesResponse?.title ||
              sessionPropertiesResponse?.detail ||
              `Login failed (${sessionPropertiesResponse?.code || "unknown"})`;
            console.error(
              "Failed to authenticate with backend. Error details:",
              {
                status: sessionPropertiesResponse?.status,
                code: sessionPropertiesResponse?.code,
                title: sessionPropertiesResponse?.title,
                description: sessionPropertiesResponse?.description,
                detail: sessionPropertiesResponse?.detail,
                fullResponse: sessionPropertiesResponse,
              }
            );
            loginInFlight.current = false;
            logoutAuthProvider(logout);
            goToAuthError(String(reason));
            return null;
          }

          setSessionProperties(sessionPropertiesResponse);
          return getSession(dataProviderUrl);
        })
        .then((signedInSession) => {
          if (!signedInSession) {
            return;
          }
          setSession(signedInSession);
          if (postLoginRedirectUri) {
            router.replace(postLoginRedirectUri);
          }
        })
        .catch((error) => {
          loginInFlight.current = false;
          console.error("Failed to authenticate with backend:", error);
          logoutAuthProvider(logout);
          goToAuthError(
            error instanceof Error ? error.message : "Login request failed"
          );
        });
    }
  }, [
    dataProviderUrl,
    getAccessTokenSilently,
    isAuthenticated,
    logout,
    postLoginRedirectUri,
    router,
    session,
  ]);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      getDataProviderUrl()
        .then((url) => {
          return getSessionProperties(url);
        })
        .then((sessionPropertiesResponse) => {
          if (sessionPropertiesResponse?.["auth.userid"]) {
            return logoutDataProvider();
          }
          return null;
        })
        .then((logoutSessionProperties) => {
          if (logoutSessionProperties) {
            setSession(null);
            setSessionProperties(null);
            router.push("/");
          }
        });
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <SessionContext.Provider
      value={{
        session,
        sessionProperties,
        profiles,
        collectionTitles,
        dataProviderUrl,
        setAuthStageLogin: () => {},
        setAuthStageLogout: () => {},
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

Session.propTypes = {
  // URL to reload after successful Auth0 and igvfd authentication
  postLoginRedirectUri: PropTypes.string,
};
