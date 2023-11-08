import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Icon from 'g45-react/components/fontawesome_icon'

function Page1() {
  return <div>
    <Helmet>
      <title>Page 1</title>
    </Helmet>
    <h1>Page 1</h1>
    <div>This is another page.</div>
    <Link to="/page1/page2">Page 2</Link>
    <Icon name="home" />
  </div>
}

export default Page1
