// Minimal zero-dependency static server for VitaLink.
// Serves /public on http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "public");
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico":  "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Cache-Control": "no-store", ...headers });
  res.end(body);
}

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";

    // Prevent traversal
    const resolved = path.normalize(path.join(ROOT, urlPath));
    if (!resolved.startsWith(ROOT)) return send(res, 403, "Forbidden");

    let filePath = resolved;
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    if (!fs.existsSync(filePath)) {
      return send(res, 404, "Not found", { "Content-Type": "text/plain" });
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    fs.createReadStream(filePath).pipe(res.writeHead(200, { "Content-Type": type }));
  } catch (err) {
    send(res, 500, "Internal error: " + err.message, { "Content-Type": "text/plain" });
  }
});

server.listen(PORT, () => {
  console.log("\n  VitaLink dev server running");
  console.log("  → http://localhost:" + PORT + "\n");
});
