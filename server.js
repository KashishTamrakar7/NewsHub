require("dotenv").config();

const express = require("express");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.NEWSDATA_API_KEY;

app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "public")));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { status: "error", message: "Too many requests. Please wait a minute and try again." }
});

app.use("/api", apiLimiter);

const allowedCategories = new Set([
  "top", "business", "crime", "domestic", "education", "entertainment",
  "environment", "food", "health", "lifestyle", "politics", "science",
  "sports", "technology", "tourism", "world"
]);

const allowedCountries = new Set([
  "in", "us", "gb", "ca", "au", "sg", "ae", "nz", "za", "fr", "de", "jp"
]);

app.get("/api/news", async (req, res) => {
  if (!API_KEY) {
    return res.status(503).json({
      status: "error",
      message: "News API key is not configured. Copy .env.example to .env and add your NewsData.io key."
    });
  }

  const category = String(req.query.category || "top").toLowerCase();
  const country = String(req.query.country || "in").toLowerCase();
  const q = String(req.query.q || "").trim().slice(0, 120);
  const page = String(req.query.page || "").trim();

  if (!allowedCategories.has(category)) {
    return res.status(400).json({ status: "error", message: "Unsupported news category." });
  }
  if (!allowedCountries.has(country)) {
    return res.status(400).json({ status: "error", message: "Unsupported country selection." });
  }

  const params = new URLSearchParams({
    country,
    language: "en",
    size: "10",
    removeduplicate: "1"
  });

  if (category !== "top") params.set("category", category);
  if (q) params.set("q", q);
  if (page) params.set("page", page);

  try {
    const response = await fetch(`https://newsdata.io/api/1/latest?${params.toString()}`, {
      headers: { "X-ACCESS-KEY": API_KEY },
      signal: AbortSignal.timeout(15000)
    });

    const data = await response.json();

    if (!response.ok || data.status === "error") {
      const message = data.results?.message || data.message || "The news provider could not complete the request.";
      return res.status(response.status === 429 ? 429 : 502).json({
        status: "error",
        message
      });
    }

    res.json({
      status: "success",
      totalResults: data.totalResults || 0,
      nextPage: data.nextPage || null,
      results: (data.results || []).map(article => ({
        article_id: article.article_id,
        title: article.title,
        description: article.description,
        link: article.link,
        image_url: article.image_url,
        source_id: article.source_id,
        source_name: article.source_name,
        creator: article.creator,
        pubDate: article.pubDate,
        category: article.category,
        country: article.country,
        language: article.language
      }))
    });
  } catch (error) {
    console.error("News provider request failed:", error.message);
    res.status(502).json({
      status: "error",
      message: "Unable to reach the news provider. Please try again shortly."
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`NewsHub is running at http://localhost:${PORT}`);
});