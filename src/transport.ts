/**
 * The authed transport, on its own entry point.
 *
 * Every app calls the API from modules that have nothing to do with React — a
 * DTO mapper, a query client, a test that runs in plain Node. Importing the
 * package root to reach `fetchWithRefresh` drags the whole component library in
 * with it, and something down in the markdown stack calls
 * `document.createElement` while it is still being imported, so a Node-side test
 * dies on `ReferenceError: document is not defined` before it runs a line.
 *
 * `@springboard-english/springboard-erp-template/transport` is this file and
 * nothing else: no components, no DOM at import time.
 */
export {
  fetchWithRefresh,
  fetchWithRetryAfter,
  refreshAccessToken,
  AUTH_SESSION_EXPIRED_EVENT,
} from "./api_calls/fetchWithRefresh";
export {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  getAccessTokenExpiry,
  armAccessTokenFromResponse,
} from "./auth/accessToken";
export { API_CONFIG, configureApi, getEndpoint } from "./config/api";
