const Service = require('egg').Service;
const ipp = require('@sealsystems/ipp');
const { host } = require('../../config/printerConfig');
const Task = require('../util/task');
const getPrintTaskQueue = require('../util/getPrintTaskQueue');

const createPrintPromise = (task) => {
  return new Promise((resolve, reject) => {
    const printer = ipp.Printer(`${host}/ipp/print`);
    printer.execute('Print-Job', task.data, (err, res) => {
      if(res) {
        // this.ctx.logger.info('任务' + taskId + '调用打印机成功', res);
        resolve(res);
      }
      if(err) {
        // this.ctx.logger.error('任务' + taskId + '调用打印机失败，', err);
        reject(err);
      }
      const printQueue = getPrintTaskQueue();
      printQueue.executingTaskCount --;
    });
  });
};

class PrintService extends Service {
  async print(buffer, taskId, created_time) {
    // const printer = ipp.Printer(`${host}/ipp/print`);
    var msg = {
      'operation-attributes-tag': {
        'requesting-user-name': 'William',
        'job-name': 'My Test Job',
        // 真实打印机传了这个参数反而会报client-error-document-format-not-supported，故去掉
        // 'document-format': 'application/pdf'
      },
      data: buffer
    };

    // 创建打印任务，入打印队列
    // 需串行
    // 结果写库
    const task = new Task(taskId, created_time, createPrintPromise, msg);
    const printQueue = getPrintTaskQueue();
    printQueue.add(task);
  }
}

module.exports = PrintService;