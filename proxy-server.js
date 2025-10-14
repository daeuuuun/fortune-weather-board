import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // CORS 허용

// ohmanda API 프록시 엔드포인트
app.get("/horoscope/:sign", async (req, res) => {
  const { sign } = req.params;

  try {
    const response = await fetch(`https://ohmanda.com/api/horoscope/${sign}`);
    const data = await response.json();
    res.json(data); // 프론트엔드로 그대로 전달
  } catch (error) {
    console.error("❌ Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch fortune" });
  }
});

app.listen(5174, () => {
  console.log("✅ Proxy server running on http://localhost:5174");
});
