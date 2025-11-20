<template>

    <div style="width: 100%">

        <google-analytics></google-analytics>

        <div class="pkb-nav">

            <div class="logo">

                <a href="/">

                    <img

                        style="height: 50px"

                        src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black-tagline.svg"

                    />

                </a>

            </div>

            <div style="display:flex; gap:10px; align-items: center;">

                <div class="menu-wrapper">

                    <div class="topmenu">

                        <a class="topmenu-item" href="/funding.html">

                            Funding Opportunities

                            <img

                                style="height: 15px; width: 15px"

                                src="https://hugeampkpncms.org/sites/default/files/images/pankbase/icons/funding_icon_black.svg"

                            />

                        </a>

                        <a class="topmenu-item disabled">

                            Search

                            <img

                                style="height: 15px; width: 15px"

                                src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/search-icon.svg"

                            />

                        </a>

                        <a class="topmenu-item disabled"> Analysis </a>

                        <a class="topmenu-item" @click.prevent="handleGoogleLogin">

                            Login

                            <img

                                style="height: 15px; width: 15px"

                                src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/user-icon.svg"

                            />

                        </a>

                    </div>

                    <div class="menu">

                        <div class="main-menu-items">

                            <div

                                v-for="item in pkbMenu.highlightItems"

                                class="menu-item-wrapper"

                                :class="{ active: isActive(item.path) }"

                            >

                                <a

                                    class="menu-item menu-item-main"

                                    :href="item.path"

                                    >{{ item.label }}</a

                                >

                            </div>

                        </div>

                        <div

                            v-for="item in pkbMenu.menuItems"

                            class="menu-item-wrapper"

                            :class="{ active: isActive(item.path) }"

                        >

                            <a class="menu-item" :href="item.path || null">{{

                                item.label

                            }}</a>

                            <div v-if="item.subMenuItems" class="submenu">

                                <a

                                    v-for="subItem in item.subMenuItems"

                                    class="submenu-item"

                                    :href="subItem.path || null"

                                    :class="{ active: isActive(subItem.path) }"

                                    :data-whatever="

                                        isActive(subItem.path).toString()

                                    "

                                    >{{ subItem.label }}</a

                                >

                            </div>

                        </div>

                    </div>

                </div>

                <a href="https://hirnetwork.org/" target="_blank">

                    <img style="height:37px" src="https://hugeampkpncms.org/sites/default/files/images/pankbase/logo-hirn.svg" />

                </a>

            </div>

            <div class="pkb-beta">beta</div>

        </div>

    </div>

</template>



<script>

import Vue from "vue";

import GoogleAnalytics from "@/components/analytics/GoogleAnalytics4.vue";

import { pkbMenu } from "@/portals/PanKbase/assets/pkbMenu.js";



let menuItemActive = false;



export default Vue.component("PkbHeader", {

    components: {

        GoogleAnalytics,

    },

    props: {

        googleOAuthClientId: {

            type: String,

            default: null,

        },

    },

    data() {

        return {

            pkbMenu,

            isGoogleLoaded: false,

        };

    },

    computed: {},

    created() {

        this.injectFavicon(

            "https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-icon.png"

        );

        this.injectFont(

            "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"

        );

        this.loadGoogleIdentityServices();

        // Handle Google OAuth callback if token is in URL

        this.handleOAuthCallback();

    },

    methods: {

        injectFavicon(faviconUrl) {

            //todo: make util

            let favicon = document.querySelector('link[rel="icon"]');

            if (!favicon) {

                favicon = document.createElement("link");

                favicon.setAttribute("rel", "icon");

                favicon.setAttribute("type", "image/png");

                document.head.appendChild(favicon);

            }

            favicon.setAttribute("href", faviconUrl);

        },

        injectFont(fontUrl) {

            //todo: make util

            const linkTag = document.createElement("link");

            linkTag.rel = "stylesheet";

            linkTag.href = fontUrl;

            document.head.appendChild(linkTag);

            linkTag.onload = () => {};

        },

        loadGoogleIdentityServices() {

            if (typeof window === "undefined") {

                return;

            }

            // Check if already loaded

            if (window.google?.accounts?.id) {

                this.isGoogleLoaded = true;

                return;

            }

            const script = document.createElement("script");

            script.src = "https://accounts.google.com/gsi/client";

            script.async = true;

            script.defer = true;

            script.onload = () => {

                this.isGoogleLoaded = true;

            };

            script.onerror = () => {

                console.error("Failed to load Google Identity Services script");

                this.isGoogleLoaded = false;

            };

            document.head.appendChild(script);

        },

        handleOAuthCallback() {

            // Handle Google OAuth callback if id_token is in URL hash

            if (typeof window === "undefined") {

                return;

            }

            const hash = window.location.hash;

            if (hash && hash.includes("id_token=")) {

                const params = new URLSearchParams(hash.substring(1));

                const idToken = params.get("id_token");

                if (idToken) {

                    try {

                        // Decode the credential (ID token) to get user info

                        const base64Url = idToken.split(".")[1];

                        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

                        const jsonPayload = decodeURIComponent(

                            atob(base64)

                                .split("")

                                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))

                                .join("")

                        );

                        const userInfo = JSON.parse(jsonPayload);

                        // Store user info and token (same as React version)

                        localStorage.setItem("google_oauth_user", JSON.stringify(userInfo));

                        localStorage.setItem("google_oauth_id_token", idToken);

                        // Clean up URL and reload to trigger React session context

                        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);

                        window.location.reload();

                    } catch (error) {

                        console.error("Error processing Google OAuth callback:", error);

                    }

                }

            }

        },

        handleGoogleLogin() {

            // Try to use the React GoogleOAuthProvider's login function if available

            // Check if there's a global login function exposed by React context

            if (window.__googleOAuthLogin) {

                window.__googleOAuthLogin();

                return;

            }

            // Otherwise, use the same Google OAuth flow as the React component

            const clientId = this.googleOAuthClientId || process.env.GOOGLE_OAUTH_CLIENT_ID || window.GOOGLE_OAUTH_CLIENT_ID;

            if (!clientId) {

                console.error("Google OAuth Client ID is not configured");

                alert("Google OAuth Client ID is not configured. Please contact an administrator.");

                return;

            }

            if (typeof window === "undefined") {

                return;

            }

            // Use the same login flow as React GoogleOAuthProvider

            if (window.google?.accounts?.id) {

                try {

                    // Initialize Google Identity Services with the same callback as React version

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

                                // Store user info and token (same as React version)

                                localStorage.setItem("google_oauth_user", JSON.stringify(userInfo));

                                localStorage.setItem("google_oauth_id_token", response.credential);

                                // Reload to trigger React session context to pick up the login

                                window.location.reload();

                            } catch (error) {

                                console.error("Error processing Google ID token:", error);

                            }

                        },

                    });

                    // Try to show One Tap prompt (same as React version)

                    window.google.accounts.id.prompt((notification) => {

                        // If One Tap can't be shown, redirect to Google OAuth

                        const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=id_token&scope=openid%20email%20profile&nonce=${Math.random()}`;

                        window.location.href = redirectUrl;

                    });

                } catch (error) {

                    console.error("Error triggering Google login:", error);

                    // Fallback: redirect to Google OAuth

                    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=id_token&scope=openid%20email%20profile&nonce=${Math.random()}`;

                    window.location.href = redirectUrl;

                }

            } else {

                // Google Identity Services not loaded, redirect directly to Google OAuth

                const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=id_token&scope=openid%20email%20profile&nonce=${Math.random()}`;

                window.location.href = redirectUrl;

            }

        },

        isActive(path) {

            //compare menu item's path to current path to set active

            //but only the first instance

            if (menuItemActive) return false;

            const currentPath = window.location.pathname;

            if (path === currentPath) {

                menuItemActive = true;

                return true;

            } else {

                return false;

            }

        },

    },

});

</script>

<style scoped>

.pkb-nav {

    position: relative;

    width: 100%;

    background: #fafafa;

    display: flex;

    justify-content: space-between;

    padding: 5px 20px 0 15px;

    border-bottom: 2px solid var(--pkb-primary-green);

    box-shadow: 0px 2px 5px var(--pkb-primary-green);

    z-index: 10;

    font-family: "Open Sans", sans-serif;

}

a,

a:visited {

    color: black !important;

}

a:hover {

    text-decoration: none;

}

.logo {

    display: flex;

    align-items: baseline;

    cursor: pointer;

    align-self: center;

}

.logo-text {

    position: relative;

    font-weight: 800;

    font-size: 18px;

    color: var(--pkb-primary-green);

    margin-left: -10px;

}

.logo-super {

    position: absolute;

    bottom: 17px;

    right: 0;

    font-weight: 500;

    font-size: 11px;

    color: var(--pkb-secondary-green);

}

.menu-wrapper {

    display: flex;

    flex-direction: column;

    align-items: flex-end;

    gap: 5px;

}

.topmenu {

    display: flex;

    align-items: center;

    gap: 0px;

}

.topmenu-item {

    color: var(--pkb-black);

    padding: 5px 10px;

    display: flex;

    align-items: center;

    gap: 5px;

    cursor: pointer;

    font-size: 12px;

}

.topmenu-item:hover {

    color: var(--pkb-secondary-green) !important;

}

.topmenu-item:hover svg * {

    stroke: var(--pkb-secondary-green) !important;

}

.topmenu-item.disabled{

    opacity: 0.5;

    pointer-events: none;

}

.menu {

    display: flex;

    font-weight: 600;

}

.menu-item-wrapper {

    position: relative;

    display: flex;

}

.main-menu-items {

    display: flex;

    position: relative;

    padding-right: 2px;

}

.main-menu-items:after {

    content: "";

    position: absolute;

    top: 7px;

    right: 0px;

    width: 2px;

    background-color: var(--pkb-primary-green);

    height: 50%;

}

.menu-item {

    position: relative;

    padding: 5px 10px;

    cursor: pointer;

    border-radius: 10px 10px 0 0;

    font-weight: 600;

    color: var(--pkb-black);

    border-bottom: 5px solid transparent;

}

.menu-item.menu-item-main {

    color: var(--pkb-primary-green) !important;

}

.menu-item.menu-item-selected {

    color: var(--pkb-primary-green);

    border-bottom: 5px solid var(--pkb-primary-green);

}

.menu-item-wrapper:hover .menu-item,

.menu-item-wrapper.active .menu-item,

.menu-item-wrapper:has(.submenu-item.active) .menu-item {

    color: var(--pkb-primary-green) !important;

    border-bottom: 5px solid var(--pkb-primary-green);

}

.menu-item-wrapper:hover > .submenu {

    display: flex;

}

.submenu {

    position: absolute;

    top: 100%;

    right: 0;

    background: var(--pkb-secondary-green);

    padding: 10px 10px 15px 15px;

    border-radius: 0 0 5px 5px;

    width: max-content;

    flex-direction: column;

    align-items: flex-end;

    gap: 5px;

    display: none;

    border-top: 2px solid var(--pkb-primary-green);

    box-shadow: inset 0 7px 5px -5px var(--pkb-primary-green);

}

.submenu-item {

    color: var(--pkb-black);

    width: -webkit-fill-available;

    text-align: right;

}

.submenu-item:hover,

.submenu-item.active {

    color: white !important;

    cursor: pointer;

}

.pkb-beta {

    height: 20px;

    line-height: 16px;

    background: #219197;

    color: white;

    padding: 2px 15px 0;

    position: absolute;

    bottom: -20px;

    left: 19px;

    mix-blend-mode: multiply;

}

</style>
