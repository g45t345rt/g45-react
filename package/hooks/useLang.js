import { createContext, useCallback, useContext, useState } from 'react'

import dictionaries from 'DICTIONARIES'
import useCookie from './useCookie'

const Context = createContext({})

const replaceHandlebar = (str, values = []) => {
  let index = 0
  return str.replace(/\{\}/g, (match) => {
    let value = match
    if (values[index] !== null) value = `${values[index]}`
    index++
    return value
  })
}

export const useLang = () => useContext(Context)

export function LangProvider(props) {
  const { children } = props

  const [cookieLang, setCookieLang] = useCookie('lang')
  const [langKey, _setLangKey] = useState(cookieLang)

  const t = useCallback((key, values) => {
    let str = key
    const dict = dictionaries[langKey]
    if (dict && dict[key]) str = dict[key]
    return replaceHandlebar(str, values)
  }, [langKey, dictionaries])

  const p = useCallback((key, pluralKey, count) => {
    // plural means any number that is not 1 so 0 is plural
    if (count === 1) return t(key, [count])
    return t(pluralKey, [count])
  }, [t])

  const setLangKey = useCallback((key) => {
    setCookieLang(key)
    _setLangKey(key)
  }, [])

  return <Context.Provider value={{ t, p, langKey, setLangKey }}>
    {children}
  </Context.Provider>
}
