import config from './Confing';

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: config.proxy.target,
      changeOrigin: true,
    }),
  );
};
