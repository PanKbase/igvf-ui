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
  const [isLoading, setIsLoading] = useState(true);
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

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

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
    setIsLoading(false);
  }, []);

  // Initialize Google Identity Services when loaded
  useEffect(() => {
    if (!isGoogleLoaded || !clientId || typeof window === "undefined") {
      // If no clientId, just mark as not loading and allow the app to work without auth
      if (!clientId) {
        setIsLoading(false);
      }
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

  // Alternative login method that shows a popup
  const loginWithPopup = useCallback(() => {
    if (!clientId) {
      console.error("Google OAuth Client ID is not configured");
      return;
    }
    if (!isGoogleLoaded || typeof window === "undefined") {
      console.error("Google Identity Services not loaded");
      return;
    }

    // Use renderButton approach or direct prompt
    window.google.accounts.id.prompt();
  }, [isGoogleLoaded, clientId]);

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
  const effectiveIsLoading = !clientId ? false : (isLoading || !isGoogleLoaded);

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
