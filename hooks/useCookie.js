import { useState, useCallback } from 'react'
import ClientCookie from 'js-cookie'
import * as HeaderCookie from 'cookie'
import useServer from './useServer'
import getHeader from '../utils/get_header'

export default function useCookie(key, initialValue) {
  const server = useServer()

  const [storedValue, setStoredValue] = useState(() => {
    if (server) {
      const { req } = server
      const cookieHeader = getHeader(req.headers, `cookie`)
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
