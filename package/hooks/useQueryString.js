import { useState, useCallback } from 'react'
import queryString from 'query-string'

import useServer from './useServer'

export default function useQueryString(initialValue) {
  const server = useServer()
  const [storedValue, setStoredValue] = useState(() => {
    let query = {}
    if (server) {
      query = queryString.parse(server.url.search)
    } else {
      query = queryString.parse(window.location.search)
    }

    if (Object.keys(query).length === 0) {
      return initialValue
    }
    
    return query
  })

  const setValue = useCallback((value, replace = true) => {
    setStoredValue(value)

    if (replace) {
      const url = queryString.stringifyUrl({ url: window.location.origin + window.location.pathname, query: value })
      window.history.replaceState(null, '', url)
    }
  }, [storedValue])

  return [storedValue, setValue]
}
