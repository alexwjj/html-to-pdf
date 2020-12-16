'use strict';
const puppeteer = require('puppeteer');

const findChrome = require('../../node_modules/carlo/lib/find_chrome');

let browser = null;

module.exports = async () => {
  if (!browser) {
    const findChromePath = await findChrome({});
    // browser = await puppeteer.launch();
    browser = await puppeteer.launch({
      headless: true,
      // chrome的默认安装路径
      executablePath: findChromePath.executablePath,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
      ],
    });
  }
  return browser;
};
