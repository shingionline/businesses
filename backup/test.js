const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');

(async () => {
  const pathToExtension = require('path').join(__dirname, '2captcha-solver');
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });
  
  const [page] = await browser.pages()

  const url = `https://www.google.com/search?q=buy+blender+south+africa+contact+email+%40+.co.za&num=200`;

  await page.goto(url, { waitUntil: "networkidle2" });

  await page.waitForSelector('.captcha-solver')
 
  await page.click('.captcha-solver')

  await page.waitForSelector(`.captcha-solver[data-state="solved"]`, {timeout: 150000})
  
  await page.click("button[type='submit']")
  
  // await browser.close();

})();