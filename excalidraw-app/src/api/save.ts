import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { drawingId, drawingData } = req.body;

  if (!drawingId || !drawingData) {
    return res.status(400).json({ error: "Missing drawingId or drawingData" });
  }

  try {
    await redis.set(`drawing:${drawingId}`, drawingData);
    return res.status(200).json({ message: "Saved successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to save drawing" });
  }
}
