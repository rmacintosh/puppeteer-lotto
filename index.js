import express from "express";
import { scrapeLogic } from "./scrapeLogic.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.listen(4000, () => {
  console.log(`Listening on port ${PORT}`);
});


/*
const getQuotes = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  });
};

// Start the scraping
getQuotes();
*/