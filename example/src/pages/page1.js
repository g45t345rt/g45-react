import { Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Icon from 'g45-react/components/fontawesome_icon'
import Age from 'g45-react/components/age'
import { LocaleNumberFormat, UTCLocaleDateFormat } from 'g45-react/components/locale_format'

function Page1() {
  return <div>
    <Helmet>
      <title>Page 1</title>
    </Helmet>
    <h1>Page 1</h1>
    <div>This is another page.</div>
    <Link to="/page1/page2">Page 2</Link>
    <Icon name="home" />
    <div>
      <div>Age 1: <Age ssrKey={30493468394} timestamp={new Date().getTime() - 1000000} /> {/* use ssrKey here because timestamp is the same on reload */}</div>
      <div>Age 2: <Age timestamp={975649935 * 1000} format={{ compact: false }} /></div>
      <div>Age 3: <Age timestamp={344497935 * 1000} format={{ compact: false }} /></div>
    </div>
    <div>
      Locales
      <div>UTC Date: <UTCLocaleDateFormat date={new Date()} options={{ weekday: "short", year: "numeric", month: "long", day: "numeric", hour: "numeric" }} /></div>
      <div>Number: <LocaleNumberFormat number={23452345} /></div>
      <div>Local Date: <Suspense>{new Date().toLocaleString()}</Suspense></div>
    </div>
  </div>
}

export default Page1
