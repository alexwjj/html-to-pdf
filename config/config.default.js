/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1578020507285_5648';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 通用错误响应
  config.onerror = {
    html(err, ctx) {
      // html hander
      ctx.body = '<h3>error</h3>';
      ctx.status = 500;
    },
    json(err, ctx) {
      ctx.body = { err };
      ctx.status = 500;
    },
  },

  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 处理跨域
  config.cors = {
    origin: '*',
  };

  return {
    ...config,
    ...userConfig,
  };
};
