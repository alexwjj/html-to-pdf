// 页面池
// 数量maxTaskCount + 10
const { maxTaskCount } = require('../../config/printerConfig');
const getBrowser = require('./getBrowser');
const DecoratePage = require('./decoratePage');

const maxSize = maxTaskCount;

module.exports = class pagePool {

  constructor() {
    this.arrPage = [];
  }

  async init() {
    // 初始化maxTaskCount + 10个page
    const browser = await getBrowser();
    for(let i = 0; i < maxSize; i ++) {
      let page = await browser.newPage();
      this.arrPage.push(new DecoratePage(page));
    }
  }

  // 获取一个可用页面
  getAvailPage() {
    // 遍历pool，获取一个可用页面
    let page = null;
    for(let i = 0; i < maxSize; i ++) {
      page = this.arrPage[i];
      if(page.inUse === false) {
        // 页面变成已占用
        page.inUse = true;
        return page;
      }
    }
  }

}