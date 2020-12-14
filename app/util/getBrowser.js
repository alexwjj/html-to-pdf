const puppeteer = require('puppeteer');

let browser = null;

module.exports = async () => {
  if(!browser) {
    // browser = await puppeteer.launch();
    browser = await puppeteer.launch({
        headless:true,
        args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--single-process'
        ]
    });
  }
  return browser;
};