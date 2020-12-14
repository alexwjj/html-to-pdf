// 打印任务队列，串行
module.exports = class PrintTaskQueue {

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
    if(this.executingTaskCount < 1) {
      const task = this.taskArr.shift();
      this.length --;
      return task;
    } else {
      return null;
    }
  }

}