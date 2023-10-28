import { Helmet } from 'react-helmet-async'
import { extractCss } from 'goober'

import Layout from './layout'

import Home from './pages/home'
import Page1 from './pages/page1'
import NotFound from './pages/notfound'

const css = extractCss()

const routes = [{
  element: <div>
    <Helmet>
      <style id="_goober">{css}</style>
    </Helmet>
    <Layout />
  </div>,
  children: [
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/page1',
      element: <Page1 />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
}]

export default routes
