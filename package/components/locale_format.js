import parser from 'accept-language-parser'

import useServer from '../hooks/useServer'
import getHeader from '../utils/get_header'

function getLocale(req) {
  const acceptLanguage = getHeader(req.headers, `accept-language`)
  const languages = parser.parse(acceptLanguage)
  if (languages.length === 0) return undefined
  return languages[0].code
}

// Browser does not provide timezone so we force UTC
// Do not use SSR with local time to avoid SSR hydration error. Use useEffect() or <Suspense>.
export function UTCLocaleDateFormat(props) {
  const { date, options } = props

  let locale = undefined // default user browser system locale
  const server = useServer()
  if (server) {
    locale = getLocale(server.req)
  }

  return new Intl.DateTimeFormat(locale, { ...options, timeZone: `UTC` }).format(date)
}

export function LocaleNumberFormat(props) {
  const { number, options } = props

  let locale = undefined
  const server = useServer()
  if (server) {
    locale = getLocale(server.req)
  }

  return new Intl.NumberFormat(locale, options).format(number)
}
