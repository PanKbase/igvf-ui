/**
 * Authentication comprises a two-step process:
 * 1. Authenticate through Google OAuth
 * 2. Send the ID token to the IGVF server so future requests use browser cookies to
 *    authenticate each request.
 * Most of the code in this file handles the server authentication step.
 */
// lib
import { DataProviderObject } from "../globals";
import { AUTH_ERROR_URI } from "./constants";
import FetchRequest from "./fetch-request";
import { ErrorObject } from "./fetch-request.d";

/**
 * Request the session object from the server, which contains the browser CSRF token.
 * @param {string} dataProviderUrl URL of the data provider instance
 * @returns {object} Session object including the CSRF token
 */
export async function getSession(
  dataProviderUrl: string
): Promise<DataProviderObject | null> {
  const request = new FetchRequest();
  const session = (
    await request.getObjectByUrl(`${dataProviderUrl}/session`)
  ).optional();

  return session;
}

/**
 * Request the session-properties object from the server, which contains the current logged-in
 * user's information.
 * @param {string} dataProviderUrl URL of the data provider instance
 * @returns {object} session-properties object
 */
export async function getSessionProperties(
  dataProviderUrl: string
): Promise<DataProviderObject | null> {
  const request = new FetchRequest();
  const sessionProps = (
    await request.getObjectByUrl(`${dataProviderUrl}/session-properties`)
  ).optional();

  return sessionProps;
}

/**
 * Request the URL of the data provider from the UI API. The FetchRequest module normally gets this
 * from environment variables, but in some unusual cases NextJS doesn't supply them (e.g. 404
 * pages).
 * @returns {string} URL of the data provider; null if unavailable
 */
export async function getDataProviderUrl(): Promise<string | null> {
  const request = new FetchRequest({ backend: true });
  const response = (await request.getObject("/api/data-provider")).optional();
  return (response?.dataProviderUrl as string) || null;
}

/**
 * Log the current user into the data provider.
 * @param {object} loggedOutSession Logged-out /session object from the server
 * @param {string} idToken Google OAuth ID token
 * @returns {object} session-properties object for the signed-in user
 */
export async function loginDataProvider(
  loggedOutSession: { _csrft_: string },
  idToken: string
) {
  const request = new FetchRequest({ session: loggedOutSession });
  return request.postObject("/login", { idToken });
}

/**
 * Log the current user out of the data provider after logging out of Google OAuth.
 * @returns {object} Empty object, because async functions have to return something
 */
export async function logoutDataProvider(): Promise<
  DataProviderObject | ErrorObject
> {
  const request = new FetchRequest();
  return (await request.getObject("/logout?redirect=false")).union();
}

/**
 * Get a URL to return to after logging in. If we're already on the error page, just return to
 * the home page so that the user doesn't see an authentication error page after successfully
 * logging in.
 * @returns {string} URL to return to after login
 */
export function getReturnUrl(): string {
  return window.location.pathname === AUTH_ERROR_URI
    ? "/"
    : `${window.location.pathname}${window.location.search}`;
}