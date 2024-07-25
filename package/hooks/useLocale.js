import parser from 'accept-language-parser'

import useServer from './useServer'
import getHeader from "../utils/get_header"

function getBrowserUserLanguage() {
  const userLanguages = navigator.languages || [navigator.language || navigator.userLanguage]
  return userLanguages[0]
}

export default function useLocale() {
  const server = useServer()

  if (server) {
    const { req } = server
    const acceptLanguage = getHeader(req.headers, `accept-language`)
    const languages = parser.parse(acceptLanguage)
    if (languages.length > 0) {
      const language = languages[0]
      if (language.region) {
        return `${language.code}-${language.region}`
      }

      return language.code
    }

    return undefined
  }

  return getBrowserUserLanguage()
}