const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8089;
const ROOT = '/root/farm-minerals-hero';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

// In-memory cache for ultra-fast frame serving
const frameCache = new Map();
const webpDir = path.join(ROOT, 'assets/tab_webp');
if (fs.existsSync(webpDir)) {
  const files = fs.readdirSync(webpDir);
  for (const file of files) {
    if (file.endsWith('.webp')) {
      const data = fs.readFileSync(path.join(webpDir, file));
      frameCache.set('/assets/tab_webp/' + file, data);
    }
  }
  console.log(`Preloaded ${frameCache.size} WebP frames into RAM.`);
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Fast path: cached WebP frame
  if (frameCache.has(pathname)) {
    const data = frameCache.get(pathname);
    res.writeHead(200, {
      'Content-Type': 'image/webp',
      'Content-Length': data.length,
      'Cache-Control': 'public, max-age=86400, immutable',
      'Connection': 'keep-alive'
    });
    return res.end(data);
  }

  const filePath = path.join(ROOT, pathname);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const headers = {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Connection': 'keep-alive'
    };

    if (ext === '.html' || ext === '.css' || ext === '.js') {
      headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    } else if (ext === '.webp' || ext === '.png' || ext === '.jpg' || ext === '.svg' || ext === '.mp4') {
      headers['Cache-Control'] = 'public, max-age=3600';
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Fast static server running on http://0.0.0.0:${PORT}`);
});
