import { Helmet } from 'react-helmet-async'
import useQueryString from 'g45-react/hooks/useQueryString'

function PageQueryString() {
  const [query, setQuery] = useQueryString({ init: true })

  return <div>
    <Helmet>
      <title>Page - QueryString</title>
    </Helmet>
    <h1>Page with querystring</h1>
    <div>{JSON.stringify(query)}</div>
    <button onClick={() => setQuery({ ...query, test: "false" })}>
      set test to false
    </button>
    <button onClick={() => setQuery({ ...query, test: "true" })}>
      set test to true
    </button>
  </div>
}

export default PageQueryString
