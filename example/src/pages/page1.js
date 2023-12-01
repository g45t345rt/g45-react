import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Icon from 'g45-react/components/fontawesome_icon'
import Age from 'g45-react/components/age'

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
  </div>
}

export default Page1
