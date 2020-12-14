const PagePool = require('./pagePool')

let pagePool = null;

module.exports = () => {
  if(!pagePool) {
    pagePool = new PagePool();
  }
  return pagePool;
};
