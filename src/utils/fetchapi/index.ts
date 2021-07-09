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
    (process.env.REACT_APP_API_ENDPOINT ||
      "https://opendata.resas-portal.go.jp/") + apiURL,
    {
      headers: { "X-API-KEY": apikey() },
    }
  );

export const checkError = (json: any) => {
  try {
    if (typeof json === "string") {
      if (json === "400") {
        return "Bad Request";
      } else if (json === "404") {
        return "Method Not Found";
      } else {
        return `Response Error: ${json}`;
      }
    } else if (json.statusCode === "403") {
      return "Response has been forbidden. You may update API KEY and try again.";
    } else if (json.statusCode === "404") {
      return "Method Not Found";
    } else if (json.message) {
      return `Error: ${json.message}`;
    }
  } catch (error) {
    return `Response ${json} has error: ${error}`;
  }
};

export default fetchapi;
