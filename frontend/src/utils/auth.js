const TOKEN_KEY = 'admin_token';

/**
 * Saves the user's authentication token to localStorage.
 * @param {string} token The JWT token received from the server.
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Retrieves the authentication token from localStorage.
 * @returns {string | null} The token if it exists, otherwise null.
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Removes the authentication token from localStorage (used for logging out).
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Creates the authorization header object for API requests.
 * @returns {object | {}} An object with the Authorization header or an empty object if no token is found.
 */
export const getAuthHeader = () => {
  const token = getToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};