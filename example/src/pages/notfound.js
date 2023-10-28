import { Helmet } from 'react-helmet-async'
import useServer from 'g45-react/hooks/useServer'

function NotFound() {
  const server = useServer()

  if (server) {
    server.statusCode = 404
  }

  return <div>
    <Helmet>
      <title>404 - Not Found</title>
    </Helmet>
    <h1>404 - Not Found</h1>
    <div>This page does not exists.</div>
  </div>
}

export default NotFound
