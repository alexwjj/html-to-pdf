const TaskQueue = require('./taskQueue')

let queue = null;

module.exports = () => {
  if(!queue) {
    queue = new TaskQueue();
  }
  return queue;
};
