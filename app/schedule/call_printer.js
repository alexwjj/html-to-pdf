'use strict';
const Subscription = require('egg').Subscription;
const getPrintTaskQueue = require('../util/getPrintTaskQueue');
const { printInterval } = require('../../config/printerConfig');

class callPrinter extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: printInterval + 's',
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const queue = getPrintTaskQueue();
    const task = queue.pop();
    if (task) {
      queue.executingTaskCount++;
      // 调用打印机
      let res = null;
      try {
        res = await task.execute();
      } catch (err) {
        res = err;
      }

      // res写库
      // task.id写task_id
      // res.statusCode写execute_result
      // if(res.statusCode === 'successful-ok')
      //    成功res写res_msg
      //    失败res写err_msg

      if (res) {
        const record = {};
        record.task_id = task.id;
        if (res.statusCode === 'successful-ok') {
          // 打印成功
          record.execute_result = 1;
          record.res_msg = JSON.stringify(res);
        } else {
          // 打印失败
          record.execute_result = 0;
          record.err_msg = JSON.stringify(res);
        }
        record.created_time = task.created_time;
        // await this.app.mysql.insert('print_task', record);
      }
    }
  }
}

// 成功响应res
// { version: '2.0',
//   statusCode: 'successful-ok',
//   id: 45154187,
//   'operation-attributes-tag':
//    { 'attributes-charset': 'utf-8',
//      'attributes-natural-language': 'en-us' },
//   'job-attributes-tag':
//    { 'job-id': 68,
//      'job-uri':
//       'ipp://parallels-parallels-virtual-platform:22222/ipp/print/68',
//      'job-state': 'processing',
//      'job-state-message': 'Job printing.',
//      'job-state-reasons': 'job-printing' } }

// 繁忙响应res
// { version: '2.0',
//   statusCode: 'server-error-busy',
//   id: 79756026,
//   'operation-attributes-tag':
//    { 'attributes-charset': 'utf-8',
//      'attributes-natural-language': 'en-us',
//      'status-message': 'Currently printing another job.' } }

// 连接失败响应
// { Error: connect ECONNREFUSED 10.211.55.6:22222
//     at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1097:14)
//   errno: 'ECONNREFUSED',
//   code: 'ECONNREFUSED',
//   syscall: 'connect',
//   address: '10.211.55.6',
//   port: 22222 }

module.exports = callPrinter;
