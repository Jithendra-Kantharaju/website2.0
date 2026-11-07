import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('out')
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.xml': 'application/xml', '.txt': 'text/plain' }
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const target = path.resolve(root, '.' + pathname)
    if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return }
    let file = target
    if ((await fs.stat(file).catch(() => null))?.isDirectory()) file = path.join(file, 'index.html')
    if (!(await fs.stat(file).catch(() => null))?.isFile()) { file = path.join(root, '404.html'); res.statusCode = 404 }
    const body = await fs.readFile(file)
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream')
    res.end(body)
  } catch { res.writeHead(500); res.end('Preview error') }
})
server.listen(3000, '127.0.0.1', () => console.log('Static production preview: http://127.0.0.1:3000'))
