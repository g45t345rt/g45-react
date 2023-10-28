import { Helmet } from 'react-helmet-async'
import Icon from 'g45-react/components/fontawesome_icon'

function Page1() {
  return <div>
    <Helmet>
      <title>Page 1</title>
    </Helmet>
    <h1>Page 1</h1>
    <div>This is another page.</div>
    <Icon name="home" />
  </div>
}

export default Page1
