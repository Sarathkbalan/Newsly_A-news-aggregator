import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
import authenticate from "../Middleware/auth.js";



dotenv.config();

const apicall = Router();
apicall.get("/news", authenticate, async (req, res) => {
  try {
    // Create the default params object
    const params = {
      country: "us",
      apiKey: process.env.NEWS_API_KEY,
      language: "en",
      pageSize: 100,
    };

    // Check if a search query is provided and add it to params
    if (req.query.query) {
      params.q = req.query.query;
    }

    const response = await axios.get("https://newsapi.org/v2/top-headlines", { params });
    res.json(response.data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Error fetching news" });
  }
});
export default apicall;


