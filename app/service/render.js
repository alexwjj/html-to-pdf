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
        displayHeaderFooter: params.displayHeaderFooter || false,
        // path: 'hm.pdf',
        footerTemplate: `
            <div style="font-size: 20px; padding-top: 5px; text-align: center; width: 100%;">
              <span>${params.footerStr}</span> - <span class="pageNumber"></span>
            </div>
          `,
        headerTemplate: `
          <div style="font-size: 20px; padding-top: 5px; text-align: center; width: 100%;">
            <span>${params.headerStr}</span> - <span class="pageNumber"></span>
          </div>
        `,
      };

      // 解决现场打印机四周空白问题
      config.margin = {
        bottom: 15,
        top: 15,
        left: 15,
        right: 15,
      };

      if (params.displayHeaderFooter) {
        config.margin = {
          bottom: 70,
          top: 70,
        };
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
