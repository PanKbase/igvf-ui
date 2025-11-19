/**
 * Establishes the context to hold the back-end session and session-properties records for
 * the currently logged-in user. You have to do this within the <GoogleOAuthProvider> component so that
 * we can get the current Google OAuth login state. The session record has only a random CSFR token while
 * logged out from the server. While logged in, it also has auth.userid with your email address.
 *
 * This module also handles signing the user into igvfd after a successful sign in to Google OAuth. It
 * does this by detecting the authentication transition from signed-out to signed in.
 */

// node_modules
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { createContext, useEffect, useState, useRef } from "react";
// components
import { useGoogleAuth } from "./google-oauth-context";
import { useSessionStorage } from "./browser-storage";
// lib
import {
  getDataProviderUrl,
  getSession,
  getSessionProperties,
  loginDataProvider,
  logoutDataProvider,
} from "../lib/google-authentication";
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
 * The current authentication stage. This is used to detect when the user has logged in or out of
 * Google OAuth so that we can then log them in or out of igvfd. Use functions from SessionContext to set
 * this state.
 */
const AUTH_STAGE_LOGIN = "login";
const AUTH_STAGE_LOGOUT = "logout";
const AUTH_STAGE_NONE = "none";

/**
 * This context provider reacts to the user logging in or out of Google OAuth by then logging in or out of
 * igvfd. It also provides other useful data retrieved from the server at page load so that child
 * modules don't need to request them again.
 *
 * This only gets used in the <App> component to encapsulate the session context. Place this within
 * the <GoogleOAuthProvider> context so that <Session> can access the current authentication state.
 */
export function Session({ authentication: _authentication, children }) {
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
  // Saves the current authentication stage across page loads
  const [_authStage, setAuthStage] = useSessionStorage(
    "auth-stage",
    AUTH_STAGE_NONE
  );

  const { isAuthenticated, isLoading, logout, getIdToken } = useGoogleAuth();
  const router = useRouter();
  // Track if we've already attempted logout to prevent loops
  const logoutAttemptedRef = useRef(false);

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

  // If we detect a transition from Google OAuth's logged-out state to logged-in state, log the user into
  // igvfd. We handle the sign in to igvfd here, *within* the GoogleOAuthProvider context.
  useEffect(() => {
    if (dataProviderUrl && isAuthenticated && !sessionProperties) {
      // Get the logged-out session object from igvfd if we don't already have it in state. We
      // need this to get the CSRF token to sign into igvfd.
      const serverSessionPromise = session
        ? Promise.resolve(session)
        : getSession(dataProviderUrl);

      serverSessionPromise
        .then(async (signedOutSession) => {
          // Get the ID token from Google OAuth
          const idToken = await getIdToken();
          if (!idToken) {
            throw new Error("No ID token available");
          }
          // Attempt to log into igvfd.
          return loginDataProvider(signedOutSession, idToken);
        })
        .then((sessionPropertiesResponse) => {
          if (
            !sessionPropertiesResponse ||
            sessionPropertiesResponse.status === "error"
          ) {
            // Google OAuth authenticated successfully, but we couldn't authenticate with igvfd. Log back
            // out of Google OAuth and go to an error page.
            // Clear session properties first to prevent logout loop
            setSessionProperties(null);
            setSession(null);
            logout();
            router.push("/auth-error");
            return null;
          }

          // Google OAuth and the server authenticated successfully. Set the session-properties object in
          // the session context so that any downstream component can retrieve it without doing a
          // request to /session-properties.
          setSessionProperties(sessionPropertiesResponse);
          return getSession(dataProviderUrl);
        })
        .then((signedInSession) => {
          if (signedInSession) {
            // Set the logged-in session object in the session context so that any downstream
            // component can retrieve it without doing a request to /session.
            setSession(signedInSession);
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
          // Clear session properties first to prevent logout loop
          setSessionProperties(null);
          setSession(null);
          logout();
          router.push("/auth-error");
        });
    }
  }, [
    dataProviderUrl,
    getIdToken,
    isAuthenticated,
    logout,
    router,
    session,
    sessionProperties,
    setSession,
  ]);

  useEffect(() => {
    // Detect that the user has logged out of Google OAuth. Respond by logging them out of igvfd.
    // Only redirect if we had a previous session (user actually logged out, not just not logged in)
    // Don't redirect if user is just browsing pages without being logged in
    // Skip if we're on the auth-error page to prevent loops
    // Check if sessionProperties actually has user data (not just an empty object)
    const hasUserSession =
      sessionProperties &&
      typeof sessionProperties === "object" &&
      (sessionProperties.user || sessionProperties.admin !== undefined);

    // Reset logout attempt flag when user becomes authenticated
    if (isAuthenticated) {
      logoutAttemptedRef.current = false;
      return;
    }

    if (
      !isAuthenticated &&
      !isLoading &&
      hasUserSession &&
      !logoutAttemptedRef.current &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/auth-error"
    ) {
      // Mark that we've attempted logout to prevent loops
      logoutAttemptedRef.current = true;

      // User logged out, clear session
      setSessionProperties(null);
      setSession(null);

      // Only log out from server if we actually had a session
      logoutDataProvider().then(() => {
        // Don't force redirect - let user stay on current page
      }).catch(() => {
        // Reset flag on error so we can retry if needed
        logoutAttemptedRef.current = false;
      });
    }
  }, [isAuthenticated, isLoading, sessionProperties]);

  return (
    <SessionContext.Provider
      value={{
        session,
        sessionProperties,
        profiles,
        collectionTitles,
        setAuthStageLogin: () => setAuthStage(AUTH_STAGE_LOGIN),
        setAuthStageLogout: () => setAuthStage(AUTH_STAGE_LOGOUT),
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

Session.propTypes = {
  // Google OAuth authentication state and transition setter
  authentication: PropTypes.exact({
    // Path to reload after successful Google OAuth authentication
    authTransitionPath: PropTypes.string.isRequired,
    // Sets the `authTransitionPath` state
    setAuthTransitionPath: PropTypes.func.isRequired,
  }).isRequired,
};
