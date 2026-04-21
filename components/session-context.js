/**
 * Establishes the context to hold the back-end session and session-properties records for
 * the currently logged-in user. You have to do this within the <Auth0Provider> component so that
 * we can get the current Auth0 login state. The session record has only a random CSFR token while
 * logged out from the server. While logged in, it also has auth.userid with your email address.
 *
 * This module also handles signing the user into igvfd after a successful sign in to Auth0. It
 * does this by detecting the <App> level state that indicates an Auth0 authentication transition
 * from signed-out to signed in.
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
  loginDataProvider,
  logoutAuthProvider,
  logoutDataProvider,
} from "../lib/authentication";
import getCollectionTitles from "../lib/collection-titles";
import { AUTH_ERROR_URI } from "../lib/constants";
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
export function Session({ postLoginRedirectUri, children }) {
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
  const { getAccessTokenSilently, isAuthenticated, isLoading, logout, user } =
    useAuth0();
  const router = useRouter();
  const backendLoginInFlight = useRef(false);
  const wasAuthenticatedRef = useRef(false);

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

  // After Auth0 signs out, clear cached API session state. Otherwise `session` can still contain
  // `auth.userid` from a previous visit and we skip POST /login while Auth0 is signed in again,
  // which matches "token OK but no /login" in the network tab.
  useEffect(() => {
    if (isLoading) {
      return undefined;
    }
    if (wasAuthenticatedRef.current && !isAuthenticated) {
      setSession(null);
      setSessionProperties(null);
      setProfiles(null);
      setCollectionTitles(null);
      backendLoginInFlight.current = false;
    }
    wasAuthenticatedRef.current = isAuthenticated;
    return undefined;
  }, [isAuthenticated, isLoading]);

  // If we detect a transition from Auth0's logged-out state to logged-in state, log the user into
  // igvfd. The callback that auth0-react calls after a successful Auth0 login exists outside the
  // Auth0Provider context, so we have to have that callback set an <App> state and then handle the
  // sign in to igvfd here, *within* the Auth0Provider context.
  useEffect(() => {
    const needsBackendLogin =
      !!user &&
      isAuthenticated &&
      !isLoading &&
      dataProviderUrl &&
      session &&
      session._csrft_ &&
      !session["auth.userid"];

    if (!needsBackendLogin || backendLoginInFlight.current) {
      return undefined;
    }

    backendLoginInFlight.current = true;

    (async () => {
      try {
        const sessionPropertiesResponse = await loginDataProvider(
          dataProviderUrl,
          session,
          getAccessTokenSilently
        );

        const isError =
          !sessionPropertiesResponse ||
          sessionPropertiesResponse.status === "error" ||
          sessionPropertiesResponse.isError === true ||
          (typeof sessionPropertiesResponse.code === "number" &&
            sessionPropertiesResponse.code >= 400);

        if (isError) {
          console.error("Backend POST /login failed:", sessionPropertiesResponse);
          logoutAuthProvider(logout, AUTH_ERROR_URI);
          return;
        }

        setSessionProperties(sessionPropertiesResponse);
        const signedInSession = await getSession(dataProviderUrl);
        setSession(signedInSession);
        if (postLoginRedirectUri) {
          router.replace(postLoginRedirectUri);
        }
      } catch (err) {
        console.error("Backend login threw:", err);
        logoutAuthProvider(logout, AUTH_ERROR_URI);
      } finally {
        backendLoginInFlight.current = false;
      }
    })();

    return undefined;
  }, [
    dataProviderUrl,
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    logout,
    router,
    session,
    user,
    postLoginRedirectUri,
  ]);

  useEffect(() => {
    // Detect that the user has logged out of Auth0. Respond by logging them out of igvfd.
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
        setAuthStageLogin: () => undefined,
        setAuthStageLogout: () => undefined,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

Session.propTypes = {
  // The URL to redirect to after the user logs in
  postLoginRedirectUri: PropTypes.string,
};
