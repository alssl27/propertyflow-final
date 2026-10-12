import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = process.cwd();
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".md": "text/plain",
};
http
  .createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      const path = resolve(
        root,
        `.${pathname === "/" ? "/index.html" : pathname}`,
      );
      if (
        !path.startsWith(root + sep) ||
        pathname.split("/").some((part) => part.startsWith(".")) ||
        pathname.startsWith("/node_modules/")
      ) {
        response.writeHead(403).end();
        return;
      }
      const content = await readFile(path);
      response
        .writeHead(200, {
          "Content-Type": `${types[extname(path)] || "application/octet-stream"}; charset=utf-8`,
          "Cache-Control": "no-store",
        })
        .end(content);
    } catch {
      response
        .writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
        .end(await readFile(resolve(root, "404.html")));
    }
  })
  .listen(4173, "127.0.0.1", () =>
    console.log("PropertyFlow: http://127.0.0.1:4173"),
  );
