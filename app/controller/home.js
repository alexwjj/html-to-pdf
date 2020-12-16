'use strict';

const Controller = require('egg').Controller;
const getTaskQueue = require('../util/getTaskQueue');
const Task = require('../util/task');
const uuidv1 = require('uuid/v1');

// let tastId = 0;

class HomeController extends Controller {
  async index() {
    const {
      ctx,
    } = this;
    ctx.body = 'hi, egg';
  }

  async print() {
    const {
      ctx,
    } = this;

    // 参数校验
    const createRule = {
      // html文档
      htmlStr: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
      // 纸张
      format: {
        type: 'string',
        required: false,
      },
      // Letter: 8.5in x 11in
      // Legal: 8.5in x 14in
      // Tabloid: 11in x 17in
      // Ledger: 17in x 11in
      // A0: 33.1in x 46.8in
      // A1: 23.4in x 33.1in
      // A2: 16.54in x 23.4in
      // A3: 11.7in x 16.54in
      // A4: 8.27in x 11.7in
      // A5: 5.83in x 8.27in
      // A6: 4.13in x 5.83in

      // 页头页尾
      headerStr: {
        type: 'string',
        required: false,
      },
      footerStr: {
        type: 'string',
        required: false,
      },
      // 是否显示页头页尾
      displayHeaderFooter: {
        type: 'boolean',
        required: false,
      },
      // 是否水平打印
      landscape: {
        type: 'boolean',
        required: false,
      },
    };
    ctx.validate(createRule);

    // 新建打印任务，进入任务队列
    const queue = getTaskQueue();

    const task = new Task(uuidv1(), new Date(), async task => {
      try {
        // 调用 Service 进行业务处理
        const file = await ctx.service.render.rend(ctx.request.body, task.id);
        await ctx.service.printer.print(file, task.id, task.created_time);
      } catch (err) {
        ctx.logger.error('任务' + task.id + '执行出错，', err);
      } finally {
        // 队列执行任务数量减1
        queue.executingTaskCount--;
        ctx.logger.info('任务' + task.id + '执行完成，当前执行总数：' + queue.executingTaskCount + '，队列中任务总数：' + queue.getLength());
      }
    });
    queue.add(task);
    ctx.logger.info('新建任务' + task.id + '，当前执行总数：' + queue.executingTaskCount + '，队列中任务总数：' + queue.getLength());

    // todo
    // 后期可加入任务执行结果记录（数据库或其他）
    // 可供调用方异步查询执行结果或将结果主动推给调用方

    // 设置响应内容和响应状态码
    ctx.body = {
      msg: 'success',
      taskId: task.id,
    };
    ctx.status = 200;
  }

  async getPdf() {
    const {
      ctx,
    } = this;

    // 参数校验
    const createRule = {
      // html文档
      htmlStr: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
      //  页面空白白边配置，默认是都为0
      margin: {
        type: 'object',
        required: false,
      },
      // 纸张
      format: {
        type: 'string',
        required: false,
      },
      //  页面渲染的缩放。默认是1。缩放值必须介于0.1到2之间
      scale: {
        type: 'number',
        required: false,
      },

      // 是否显示页码 eg：1/4
      displayPageNumber: {
        type: 'boolean',
        required: false,
      },
      // 是否水平打印
      landscape: {
        type: 'boolean',
        required: false,
      },
    };
    ctx.validate(createRule);

    let body = {};
    let status = 200;
    try {
      const pdf = await ctx.service.render.rend(ctx.request.body, '');
      status = 200;
      body = pdf;
    } catch (err) {
      status = 401;
      body = err;
    }
    // 设置响应内容和响应状态码
    ctx.set({
      'Content-Type': 'application/pdf',
    });
    ctx.body = body;
    ctx.status = status;
  }
}

module.exports = HomeController;
