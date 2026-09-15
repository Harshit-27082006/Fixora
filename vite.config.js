import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import url from 'node:url';

// Vite development server plugin to handle /api/auth and /api/complaints
function apiServerPlugin() {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        if (pathname === '/api/auth' || pathname === '/api/complaints') {
          // Parse request body for POST/PATCH/PUT
          let body = {};
          if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const rawBody = Buffer.concat(buffers).toString('utf-8');
            if (rawBody.trim()) {
              try {
                body = JSON.parse(rawBody);
              } catch (e) {
                body = {};
              }
            }
          }

          // Vercel serverless request/response facade
          const vercelReq = {
            method: req.method,
            query: parsedUrl.query || {},
            body: body,
            headers: req.headers
          };

          const vercelRes = {
            statusCode: 200,
            setHeader(name, value) {
              res.setHeader(name, value);
            },
            status(code) {
              this.statusCode = code;
              return this;
            },
            json(data) {
              res.statusCode = this.statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            },
            end(data) {
              res.statusCode = this.statusCode;
              res.end(data);
            }
          };

          try {
            if (pathname === '/api/auth') {
              const { default: authHandler } = await import('./api/auth.js');
              await authHandler(vercelReq, vercelRes);
              return;
            } else if (pathname === '/api/complaints') {
              const { default: complaintsHandler } = await import('./api/complaints.js');
              await complaintsHandler(vercelReq, vercelRes);
              return;
            }
          } catch (err) {
            console.error('Error in local API handler:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiServerPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
