// 封装的页面对象
module.exports = class DecoratePage {

    constructor(page) {
      this.page = page;
      // 默认未被使用
      this.inUse = false;
    }

    getActualPage() {
      return this.page;
    }
  
  }