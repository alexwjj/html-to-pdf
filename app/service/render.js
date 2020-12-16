'use strict';

const Service = require('egg').Service;
// const getBrowser = require('../util/getBrowser');
const getPagePool = require('../util/getPagePool');

class RenderService extends Service {
  async rend(params) {
    let buffer = null;
    let decoratePage = null;
    let page = null;
    try {
      // const browser = await getBrowser();
      // page = await browser.newPage();

      // 获取page
      const pagePool = getPagePool();
      decoratePage = pagePool.getAvailPage();
      page = decoratePage.getActualPage();

      // await page.goto('https://www.iqiyi.com/a_19rrhzy37l.html?vfrm=pcw_home&vfrmblk=B&vfrmrst=fcs_0_p11', {waitUntil: 'networkidle2'});
      // await page.goto('http://localhost:8084/test.html', {waitUntil: 'networkidle2'});
      // https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#pagepdfoptions
      // await page.goto('http://localhost:8084/test1.html', {waitUntil: 'networkidle2'});
      page.setCacheEnabled(false);

      // await page.goto('https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#pagepdfoptions', {waitUntil: 'networkidle2'});
      const data = params.htmlStr;
      await page.setContent(data, { waitUntil: 'networkidle2', timeout: 10000 });
      await page.emulateMedia('screen');

      const config = {
        format: params.format || 'A4',
        printBackground: true,
        landscape: params.landscape || false,
        margin: params.margin || {},
        scale: params.scale || 1,
        displayHeaderFooter: params.displayPageNumber || false,
        // path: 'hm.pdf',
        footerTemplate: `<div style="width:100%;text-align:center;padding:10px 0;font-size:14px">
          <span class="pageNumber"> </span> / <span class="totalPages"></span>
          </div>`,
        // headerTemplate: params.headerStr,
      };

      if (params.displayPageNumber) {
        config.margin.bottom = 70;
      }

      buffer = await page.pdf(config);
    } catch (err) {
      throw err;
    } finally {
      if (decoratePage) {
        decoratePage.inUse = false;
      }
    }
    // await browser.close();
    return buffer;
  }
}

module.exports = RenderService;
