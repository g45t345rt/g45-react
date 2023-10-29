import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { ServerProvider } from '../hooks/useServer'
import { ServerDataProvider, getServerDataContext } from '../hooks/useServerData'
import { LangProvider } from '../hooks/useLang'

function App(props) {
  const { router, serverContext, helmetContext = {}, serverDataContext = getServerDataContext() } = props

  return <HelmetProvider context={helmetContext}>
    <Helmet>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/public/favicon.ico" />
      <link rel="preload" href="/public/client.css" as="style" />
      <link rel="preload" href="/public/client.js" as="script" />
      <link rel="stylesheet" href="/public/client.css" />
    </Helmet>
    <ServerProvider context={serverContext}>
      <ServerDataProvider context={serverDataContext}>
        <LangProvider>
          <RouterProvider router={router} />
        </LangProvider>
      </ServerDataProvider>
    </ServerProvider>
  </HelmetProvider>
}

export default App
