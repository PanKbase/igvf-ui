/**
 * Google OAuth Context Provider using Google Identity Services
 * Provides Google OAuth authentication state and methods throughout the app
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

const GoogleOAuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: () => {},
  logout: () => {},
  getIdToken: () => Promise.resolve(null),
});

export function useGoogleAuth() {
  return useContext(GoogleOAuthContext);
}

export function GoogleOAuthProvider({ children, clientId }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Load Google Identity Services script
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Check if already loaded
    if (window.google?.accounts?.id) {
      setIsGoogleLoaded(true);
      return;
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      // Script exists, wait for it to load
      if (window.google?.accounts?.id) {
        setIsGoogleLoaded(true);
      } else {
        existingScript.addEventListener('load', () => {
          setIsGoogleLoaded(true);
        });
        existingScript.addEventListener('error', () => {
          console.error("Failed to load Google Identity Services script");
          setIsGoogleLoaded(false);
        });
      }
      return;
    }

    let script = null;
    let timeout = null;
    let retryCount = 0;
    const maxRetries = 3;

    const loadScript = () => {
      // Remove any existing script first
      const oldScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (oldScript && oldScript !== script) {
        oldScript.remove();
      }

      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      
      script.onload = () => {
        // Double check that Google is actually available
        if (window.google?.accounts?.id) {
          setIsGoogleLoaded(true);
          if (timeout) clearTimeout(timeout);
        } else {
          // Script loaded but Google not available, retry
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(loadScript, 1000 * retryCount);
          } else {
            console.error("Google Identity Services script loaded but API not available");
            setIsGoogleLoaded(false);
          }
        }
      };
      
      script.onerror = () => {
        console.error(`Failed to load Google Identity Services script (attempt ${retryCount + 1}/${maxRetries + 1})`);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(loadScript, 1000 * retryCount);
        } else {
          setIsGoogleLoaded(false);
          // Still allow login attempts - the login function will handle redirect
        }
      };
      
      document.head.appendChild(script);
    };

    loadScript();

    // Timeout: if Google doesn't load within 15 seconds, allow login anyway
    timeout = setTimeout(() => {
      if (!isGoogleLoaded && window.google?.accounts?.id) {
        setIsGoogleLoaded(true);
      } else if (!isGoogleLoaded) {
        console.warn("Google Identity Services script loading timeout - login will use redirect fallback");
      }
    }, 15000);

    return () => {
      if (timeout) clearTimeout(timeout);
      // Don't remove script on cleanup as it might be used by other components
    };
  }, [isGoogleLoaded]);

  // Handle OAuth callback from redirect flow
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Check URL hash for ID token (OAuth redirect response)
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get('id_token');
      const error = params.get('error');
      
      if (error) {
        console.error("Google OAuth error:", error, params.get('error_description'));
        // Clear hash to prevent re-processing
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        return;
      }
      
      if (idToken) {
        try {
          // Decode the ID token
          const base64Url = idToken.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const userInfo = JSON.parse(jsonPayload);

          setUser(userInfo);
          setIdToken(idToken);
          setIsAuthenticated(true);
          localStorage.setItem("google_oauth_user", JSON.stringify(userInfo));
          localStorage.setItem("google_oauth_id_token", idToken);
          
          // Clear hash to prevent re-processing
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (error) {
          console.error("Error processing Google ID token from redirect:", error);
          // Clear hash
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        return;
      }
    }

    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("google_oauth_user");
    const storedToken = localStorage.getItem("google_oauth_id_token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setIdToken(storedToken);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        localStorage.removeItem("google_oauth_user");
        localStorage.removeItem("google_oauth_id_token");
      }
    }
  }, []);

  // Initialize Google Identity Services when loaded
  useEffect(() => {
    if (!isGoogleLoaded || !clientId || typeof window === "undefined") {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        try {
          // Decode the credential (ID token) to get user info
          const base64Url = response.credential.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const userInfo = JSON.parse(jsonPayload);

          setUser(userInfo);
          setIdToken(response.credential);
          setIsAuthenticated(true);
          localStorage.setItem("google_oauth_user", JSON.stringify(userInfo));
          localStorage.setItem("google_oauth_id_token", response.credential);
        } catch (error) {
          console.error("Error processing Google ID token:", error);
        }
      },
    });
  }, [isGoogleLoaded, clientId]);

  // Login method that triggers Google Sign-In
  const loginWithPopup = useCallback(() => {
    if (!clientId) {
      console.error("Google OAuth Client ID is not configured");
      alert("Google OAuth Client ID is not configured. Please contact an administrator.");
      return;
    }
    if (typeof window === "undefined") {
      return;
    }

    // Helper function to create redirect URL
    const createRedirectUrl = () => {
      const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const redirectUri = encodeURIComponent(window.location.origin);
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=openid%20email%20profile&nonce=${nonce}`;
    };

    // Always use redirect approach - it's more reliable than One Tap
    // One Tap can be blocked by browsers, ad blockers, or fail to load
    // Redirect is the standard OAuth flow and works consistently
    console.log("Initiating Google OAuth login via redirect");
    window.location.href = createRedirectUrl();
  }, [clientId]);

  const logout = useCallback(() => {
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    setIsAuthenticated(false);
    setUser(null);
    setIdToken(null);
    localStorage.removeItem("google_oauth_user");
    localStorage.removeItem("google_oauth_id_token");
  }, []);

  const getIdToken = useCallback(async () => {
    if (idToken) {
      return idToken;
    }
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("google_oauth_id_token");
      if (storedToken) {
        setIdToken(storedToken);
        return storedToken;
      }
    }
    return null;
  }, [idToken]);

  // If no clientId, don't wait for Google to load
  // Don't block the button forever - allow login attempts even if Google is still loading
  // The login function will handle the case where Google isn't loaded yet
  const effectiveIsLoading = !clientId ? false : false; // Always allow login button to be enabled

  const value = {
    isAuthenticated,
    isLoading: effectiveIsLoading,
    user,
    login: loginWithPopup,
    logout,
    getIdToken,
  };

  return (
    <GoogleOAuthContext.Provider value={value}>
      {children}
    </GoogleOAuthContext.Provider>
  );
}

GoogleOAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  clientId: PropTypes.string.isRequired,
};
