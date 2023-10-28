import { Helmet } from 'react-helmet-async'
import { Link, Outlet } from 'react-router-dom'
import { useLang } from 'g45-react/hooks/useLang'

function Layout() {
  return <div>
    <Helmet titleTemplate="%s - Example" />
    <div>Layout</div>
    <div>
      <Link to="/">Home</Link>
      <Link to="/page1">Page 1</Link>
    </div>
    <LangSwitch />
    <Outlet />
  </div>
}

function LangSwitch() {
  const { langKey, setLangKey } = useLang()

  return <div>
    <div>Page language key is <strong>[{langKey}]</strong></div>
    <button onClick={() => setLangKey('en')}>English</button>
    <button onClick={() => setLangKey('fr')}>French</button>
    <button onClick={() => setLangKey('es')}>Spanish</button>
  </div>
}

export default Layout