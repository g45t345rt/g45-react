import parser from 'accept-language-parser'

import useServer from './useServer'
import getHeader from "../utils/get_header"

export default function useLocale() {
  const server = useServer()

  let locale = undefined // undefined for using the default user browser system locale
  if (server) {
    const { req } = server
    const acceptLanguage = getHeader(req.headers, `accept-language`)
    const languages = parser.parse(acceptLanguage)
    if (languages.length > 0) {
      locale = languages[0].code // use the first locale
    }
  }

  return locale
}