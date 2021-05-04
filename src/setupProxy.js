const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.BACKEND_API_URL || 'http://localhost:8080',
      changeOrigin: true,
    }),
  );
};
