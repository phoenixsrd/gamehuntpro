import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const file = path.join(process.cwd(), "freebies.json");
  if (!fs.existsSync(file)) {
    return res.status(200).json([]);
  }
  const data = fs.readFileSync(file, "utf-8");
  res.status(200).json(JSON.parse(data));
}
