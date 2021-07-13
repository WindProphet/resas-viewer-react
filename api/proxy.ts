import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default (req: VercelRequest, res: VercelResponse) => {
  const api =
    typeof req.headers["X-API-KEY"] === "string"
      ? req.headers["X-API-KEY"]
      : process.env.API_KEY;
  fetch("https://opendata.resas-portal.go.jp/" + req.query.url, {
    headers: { "X-API-KEY": api },
  })
    .then((r) => r.json())
    .then(res.send)
    .catch((err) => res.status(500).send(err));
};
