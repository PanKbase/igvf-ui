# Updating Components from Auth0 to Google OAuth

Several components still use `useAuth0()` from `@auth0/auth0-react`. They need to be updated to use `useGoogleAuth()` from the new Google OAuth context.

## Components That Need Updating

The following components use `useAuth0()` and should be updated:

1. `components/error.js`
2. `components/no-collection-data.js`
3. `components/page.js`
4. `components/add-object-trigger.js`
5. `components/facets/custom-facets/audit-internal-action-terms.js`
6. `components/facets/custom-facets/audit-title.js`
7. `components/edit-func.js`
8. `components/audit.js`
9. `components/add.js`

## Update Pattern

### Before (Auth0):
```javascript
import { useAuth0 } from "@auth0/auth0-react";

function MyComponent() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  
  // ... component code
}
```

### After (Google OAuth):
```javascript
import { useGoogleAuth } from "../components/google-oauth-context";

function MyComponent() {
  const { isAuthenticated, login } = useGoogleAuth();
  
  // ... component code
  // Replace loginWithRedirect() calls with login()
}
```

## Specific Updates Needed

### For `loginWithRedirect()` calls:
- **Before:** `loginWithRedirect({ appState: { returnTo: path } })`
- **After:** `login()` (the return URL is handled automatically)

### For `getAccessTokenSilently()` calls:
- **Before:** `await getAccessTokenSilently()`
- **After:** `await getIdToken()` (returns the Google ID token)

### For `logout()` calls:
- Both APIs have a `logout()` function, but the signature may differ
- Google OAuth: `logout()` (no parameters needed)

## Example: Updating error.js

```javascript
// Before
import { useAuth0 } from "@auth0/auth0-react";
const { isAuthenticated, loginWithRedirect } = useAuth0();

// After
import { useGoogleAuth } from "./google-oauth-context";
const { isAuthenticated, login } = useGoogleAuth();

// Update login call
// Before: loginWithRedirect({ appState: { returnTo: returnUrl } })
// After: login()
```

## Testing After Updates

After updating each component:
1. Test that authentication checks still work
2. Test that login buttons/links trigger Google OAuth
3. Test that protected content is properly hidden/shown
4. Check browser console for any errors

