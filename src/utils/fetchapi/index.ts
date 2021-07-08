/**
 * Get RESAS API key from localStorage or node environment
 * @returns RESAS API key
 */
export const apikey = () =>
  window.localStorage.getItem("api_key") || process.env.REACT_APP_API_KEY || "";

/**
 * Wrap `fetch` for RESAS REST API
 * @param apiURL REST API path
 */
export const fetchapi = (apiURL: string) =>
  fetch(
    (process.env.REACT_APP_API_ENDPOINT || "https://opendata.resas-portal.go.jp/") +
      apiURL,
    {
      headers: { "X-API-KEY": apikey() },
    }
  );

export default fetchapi;
