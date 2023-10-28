import { useState, useCallback } from 'react'
import ClientCookie from 'js-cookie'
import HeaderCookie from 'cookie'

import useServer from './useServer'

export default function useCookie(key, initialValue) {
  const server = useServer()

  const [storedValue, setStoredValue] = useState(() => {
    if (server) {
      let cookieHeader = ''
      const headers = server.req.headers
      if (headers) {
        if (typeof headers.get === `function`) {
          // cf worker https://developers.cloudflare.com/workers/examples/extract-cookie-value
          cookieHeader = headers.get('Cookie') || ''
        } else {
          // node
          cookieHeader = headers['cookie'] || ''
        }
      }

      const cookies = HeaderCookie.parse(cookieHeader || '')
      const data = cookies[key]
      if (data === undefined) return initialValue
      return data
    }

    const cookie = ClientCookie.get(key)
    if (cookie === undefined) return initialValue
    return cookie
  })

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    ClientCookie.set(key, valueToStore, { path: '/' })
  }, [storedValue])

  return [storedValue, setValue]
}
