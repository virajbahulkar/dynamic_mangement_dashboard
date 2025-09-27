const { createProxyMiddleware } = require('http-proxy-middleware');

// Proxy API requests in development to avoid CORS and hardcoded bases.
// This file is used by react-scripts when running `npm start`.
module.exports = function (app) {
  // Prefer explicit env (API_PROXY_TARGET or REACT_APP_API_BASE). Fallback to docker service name, then localhost.
  const target = process.env.API_PROXY_TARGET
    || process.env.REACT_APP_API_BASE
    || 'http://server:3002'
    || 'http://localhost:3002';
  const commonOptions = {
    target,
    changeOrigin: true,
    secure: false,
    logLevel: 'warn',
    onProxyReq: (proxyReq, req) => {
      // Ensure correlation id header is forwarded if present
      const cid = req.headers['x-correlation-id'];
      if (cid) proxyReq.setHeader('x-correlation-id', cid);
    },
  };

  app.use(
    ['/config', '/metrics', '/meta', '/default', '/dashboard-config', '/health', '/registry', '/pages', '/drafts', '/users'],
    createProxyMiddleware(commonOptions)
  );
};
