const getBrowser = require('./app/util/getBrowser');
const getTaskQueue = require('./app/util/getTaskQueue');
const getPrintTaskQueue = require('./app/util/getPrintTaskQueue');
const getPagePool = require('./app/util/getPagePool');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    await getBrowser();
    getTaskQueue();
    getPrintTaskQueue();
    // 初始化页面池
    const pagePool = getPagePool();
    pagePool.init();
  }

  async didReady() {
    await this.app.runSchedule('execute_print');
    await this.app.runSchedule('call_printer');
  }

}

module.exports = AppBootHook;
