const PrintTaskQueue = require('./printTaskQueue')

let queue = null;

module.exports = () => {
  if(!queue) {
    queue = new PrintTaskQueue();
  }
  return queue;
};
