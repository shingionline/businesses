const { userAgents } = require('./agents');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
const axios     = require('axios').default;
// const apiHost   = 'https://twigga.site';
const apiHost   = 'http://localhost:8005';
const pathToExtension = require('path').join(__dirname, '2captcha-solver');
const proxy     = 'gw.dataimpulse.com:823';
const username  = '2992af98c0d5eefb3aeb';
const password  = 'ed0767d386c7acc4';

puppeteer
.use(StealthPlugin())

const useProxy    = false;
const useHeadless = false;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let argsArray = [
//   `--disable-extensions-except=${pathToExtension}`,
//   `--load-extension=${pathToExtension}`,
  `--start-maximized`,
  `--no-sandbox`
];

if (useProxy) {
    argsArray.push(`--proxy-server=${proxy}`);
}

const chromeOptions = {
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: useHeadless,
    args: argsArray,
};

/*
const chromeOptions = {
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: useHeadless,
    slowMo: 20,
    defaultViewport: null,
    args: argsArray,
};
*/

module.exports = { puppeteer, username, password, chromeOptions, apiHost, axios, useProxy, userAgents };
