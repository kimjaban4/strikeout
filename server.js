const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4173);
const root = __dirname;
const imageRoot = path.join(path.dirname(root), "이미지");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

function isInside(base, target) {
  const relative = path.relative(base, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function resolveStaticPath(normalizedPath) {
  const safePath = path.normalize(normalizedPath).replace(/^(\.\.[/\\])+/, "");

  if (safePath === "이미지" || safePath.startsWith(`이미지${path.sep}`)) {
    const imagePath = path.join(imageRoot, safePath.replace(/^이미지[/\\]?/, ""));
    return isInside(imageRoot, imagePath) ? imagePath : null;
  }

  const filePath = path.join(root, safePath);
  return isInside(root, filePath) ? filePath : null;
}

http
  .createServer((req, res) => {
    const requestPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
    const normalizedPath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
    const filePath = resolveStaticPath(normalizedPath);

    if (!filePath) {
      send(res, 403, "Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        send(res, 404, "Not found");
        return;
      }

      send(res, 200, data, types[path.extname(filePath)] || "application/octet-stream");
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`마운드 심리전 실행 중: http://127.0.0.1:${port}`);
  });
