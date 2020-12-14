// 任务队列
const { maxTaskCount } = require('../../config/printerConfig');

module.exports = class TaskQueue {

  constructor() {
    this.taskArr = new Array();
    // 当前正在执行的所有任务
    this.executingTaskCount = 0;
    this.length = 0;
  }

  add(task) {
    this.taskArr.push(task);
    this.length ++;
  }

  getLength() {
    return this.length;
  }

  pop() {
    if(this.length <= 0) {
      return null;
    }
    if(this.executingTaskCount < maxTaskCount) {
      const task = this.taskArr.shift();
      this.length --;
      return task;
    } else {
      return null;
    }
  }

}