// 任务
module.exports = class Task {

  constructor(id, created_time, executeFn, data) {
    this.id = id;
    this.executeFn = executeFn;
    this.data = data;
    this.created_time = created_time;
  }

  execute() {
    return this.executeFn(this);
  }

}