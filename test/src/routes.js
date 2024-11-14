import { Helmet } from 'react-helmet-async'
import { extractCss } from 'goober'

import Layout from './layout'

import Home from './pages/home'
import Page1 from './pages/page1'
import Page2 from './pages/page2'
import PageQueryString from './pages/page_qs'
import NotFound from './pages/notfound'

const css = extractCss()

const routes = [{
  element: <div>
    <Helmet>
      <style>{css}</style> {/* Don't use id="_goober" or css will flicker. Probably an issue with goober reseting css.*/}
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
      element: <Page1 />,
    },
    {
      path: '/qs',
      element: <PageQueryString />,
    },
    {
      path: '/page1/page2',
      element: <Page2 />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
}]

export default routes
