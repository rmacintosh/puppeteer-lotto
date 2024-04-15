import puppeteer from "puppeteer";
import { config } from 'dotenv';

const scrapeLogic = async (res) => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
    ],
    executablePath: 
        process.env.NODE_ENV === 'production'
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    headless: true,
    defaultViewport: null,
  });

  try {
    const page = await browser.newPage();

    // for headless mode
    const ua =    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";  
    await page.setUserAgent(ua);

    // Navigate the page to a URL
    await page.goto('https://playalberta.ca/lottery', {
      waitUntil: "networkidle0",
    });

    await page.waitForSelector('.rd-dbg-card-content');

    const lottery = await page.evaluate(() => {
      // Fetch the first element with class 'quote'
      const lottos = document.querySelectorAll(".rd-dbg-card-content");
      if(lottos == null) {
        console.log(".rd-dbg-card-content FAIL!!!");
        return 0;
      }
      // convert the lotto list into an iterable array
      return Array.from(lottos).map((lotto) => {
        // rd-dbg-img-wrapper
        var alt = lotto.getElementsByTagName('img')[0].alt; // assuming a single image tag

        var prize = lotto.querySelector(".rd-dbg-prize");
        if(prize != null)
          prize = lotto.querySelector(".rd-dbg-prize").textContent;
        else {
          console.log(".rd-dbg-prize FAIL!");
          prize = "oops - prize not there";
        }

        var extra = lotto.querySelector(".rd-dbg-extended-jackpot-info");
        if(extra != null)
          extra = lotto.querySelector(".rd-dbg-extended-jackpot-info").textContent;
        else {
          console.log(".rd-dbg-extended-jackpot-info FAIL!");
          prize = "oops - extra not there";
        }
        return { alt, prize, extra };
      });
    });

    const logStatement = `Data scraped from PlayAlberta.ca: ${lottery}`;
    console.log(logStatement);
    res.send(logStatement);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

export { scrapeLogic };