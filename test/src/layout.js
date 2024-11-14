import { Helmet } from 'react-helmet-async'
import { Link, Outlet } from 'react-router-dom'
import { useLang } from 'g45-react/hooks/useLang'
import { PreloadFonts } from 'g45-react/components/fontawesome_icon'

import faviconUrl from '../assets/favicon.ico'

function Layout() {
  return <div>
    <Helmet titleTemplate="%s - Test">
      <link rel="icon" href={faviconUrl} />
    </Helmet>
    <PreloadFonts />
    <div>Layout</div>
    <div>
      <Link to="/">Home</Link>
      <Link to="/page1">Page 1</Link>
      <Link to="/qs?test=true&value=1">Page QueryString</Link>
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