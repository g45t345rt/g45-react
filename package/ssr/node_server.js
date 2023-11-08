import path from 'path'
import express from 'express'

import ssr from './ssr'

const app = express()

app.use(`/public`, express.static(path.join(__dirname, 'public')))

app.use(`*`, async (req, res) => {
  const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
  const serverContext = { req, statusCode: 200 }
  const html = await ssr({
    path: url.pathname || '/',
    serverContext,
    base: `${url.origin}/`
  })

  res.writeHead(serverContext.statusCode, { 'Content-Type': 'text/html;charset=UTF-8' })
  res.end(html)
})

const hostname = process.env.HOSTNAME || '127.0.0.1'
const port = process.env.PORT || 3000

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
