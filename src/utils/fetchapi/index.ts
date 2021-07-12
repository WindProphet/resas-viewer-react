/**
 * Get RESAS API key from localStorage or node environment
 * @returns RESAS API key
 */
export const apikey = () =>
  window.localStorage.getItem("api_key") || process.env.REACT_APP_API_KEY || "";

/**
 * Wrap `fetch` for RESAS REST API
 *
 * Base URL will be defined from env `REACT_APP_API_ENDPOINT` or default one
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

/**
 * check whether the response is an error message
 *
 * @returns Error message
 * @example
 * let res = await fetchapi("api/v1/prefectures");
 * let msg = await res.json();
 * let error = checkError(msg);
 * if (error) {
 *   setError(error);
 *   return;
 * }
 * ...
 */
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
