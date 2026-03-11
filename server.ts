import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // News API Proxy
  app.get("/api/news", async (req, res) => {
    const { category = "general", q, lang = "en" } = req.query;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "NEWS_API_KEY not configured" });
    }

    try {
      // GNews.io API uses 'token' parameter for the API key
      let url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${lang}&token=${apiKey}`;
      
      if (q) {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q as string)}&lang=${lang}&token=${apiKey}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        console.error("News API Response Error:", data);
        return res.status(response.status).json({ 
          error: data.errors?.[0] || data.message || "Failed to fetch news from provider",
          details: data
        });
      }

      res.json(data);
    } catch (error: any) {
      console.error("News API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
