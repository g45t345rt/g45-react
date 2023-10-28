// This code is for running the app with server side rendering
// Check out cloudflare_worker.js to run with cloudflare pages or use node_server.js to run your own server

import React from 'react'
React.useLayoutEffect = React.useEffect // https://stackoverflow.com/questions/58070996/how-to-fix-the-warning-uselayouteffect-does-nothing-on-the-server

import { createMemoryRouter } from 'react-router-dom'

import App from '../app'
import { renderApp, serverDataScript, getServerDataContext } from '../hooks/useServerData'
import routes from 'ROUTES_PATH'

export default async ({ path, serverContext }) => {
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

  return template({ html, helmetContext, serverDataContext })
}

const template = ({ html, helmetContext, serverDataContext }) => {
  const { helmet } = helmetContext
  const { data } = serverDataContext
  return `
    <!DOCTYPE html>
    <html>

    <head ${helmet.htmlAttributes.toString()}>
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${helmet.style.toString()}
    </head>

    <body ${helmet.bodyAttributes.toString()}>
      <div id="app">${html}</div>
      ${serverDataScript(data)}
      <script src="/public/client.js"></script>
    </body>

    </html>
  `
}