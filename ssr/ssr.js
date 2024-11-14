// This code is for running the app with server side rendering
// Check out cloudflare_worker.js to run with cloudflare pages or use node_server.js to run your own server

import React from 'react'
React.useLayoutEffect = React.useEffect // https://stackoverflow.com/questions/58070996/how-to-fix-the-warning-uselayouteffect-does-nothing-on-the-server

import { createMemoryRouter } from 'react-router-dom'

import App from '../app'
import { renderApp, serverDataScript, getServerDataContext } from '../hooks/useServerData'
import routes from 'ROUTES_PATH'

export default async ({ path, serverContext, base }) => {
  const helmetContext = {}
  const serverDataContext = getServerDataContext()
  const router = createMemoryRouter(routes, {
    initialEntries: [path]
  })

  const html = await renderApp({
    serverContext,
    serverDataContext,
    app: <App
      router={router}
      serverContext={serverContext}
      helmetContext={helmetContext}
      serverDataContext={serverDataContext}
    />,
  })

  return template({ html, helmetContext, serverDataContext, base })
}

const template = ({ html, helmetContext, serverDataContext, base }) => {
  const { helmet } = helmetContext
  const { data } = serverDataContext

  // we set a <base> tag because we use relative paths for assets (we need this for index build)
  // if we don't use <base> for ssr while browsing further down a path, it won't load assets correctly
  // ex: fetching a page `/page1/page2` the browser will try to load the asset from the same directory `/page1/page2/public/img.png` but we want `/public/img.png`

  return `
    <!DOCTYPE html>
    <html>

    <head ${helmet.htmlAttributes.toString()}>
      <base href="${base}">
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${helmet.style.toString()}
    </head>

    <body ${helmet.bodyAttributes.toString()}>
      <div id="app">${html}</div>
      ${serverDataScript(data)}
      <script src="public/client.js" defer></script>
    </body>

    </html>
  `
}