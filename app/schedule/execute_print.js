const Subscription = require('egg').Subscription;
const getTaskQueue = require('../util/getTaskQueue');

class executePrint extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '500',
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const queue = getTaskQueue();
    const task = queue.pop();
    if(task) {
      queue.executingTaskCount ++;
      // 执行打印
      this.ctx.logger.info('开始执行任务：' + task.id + '，当前执行总数：' + queue.executingTaskCount + '，队列中任务总数：' + queue.getLength());
      task.execute();
    }
  }
}

module.exports = executePrint;