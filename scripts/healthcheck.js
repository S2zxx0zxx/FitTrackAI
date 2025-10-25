#!/usr/bin/env node

const https = require('https');

const healthCheck = async () => {
  try {
    const status = {
      app: 'unknown',
      timestamp: new Date().toISOString()
    };

    // Check frontend
    const frontendCheck = new Promise((resolve) => {
      https.get(process.env.FRONTEND_ORIGIN || 'http://localhost:5173', (res) => {
        status.app = res.statusCode === 200 ? 'healthy' : 'degraded';
        resolve();
      }).on('error', () => {
        status.app = 'unhealthy';
        resolve();
      });
    });

    await frontendCheck;
    console.log(JSON.stringify(status, null, 2));
    process.exit(status.app === 'healthy' ? 0 : 1);
  } catch (error) {
    console.error('Health check failed:', error);
    process.exit(1);
  }
};

healthCheck();