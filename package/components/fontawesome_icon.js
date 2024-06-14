import '@fortawesome/fontawesome-free/css/fontawesome.css'
import '@fortawesome/fontawesome-free/css/solid.css'
import '@fortawesome/fontawesome-free/css/regular.css'
import '@fortawesome/fontawesome-free/css/brands.css'
import { Helmet } from 'react-helmet-async'

import { preloadWOFF } from '../utils/preload'
import faSolidUrl from '@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2'
import faRegularUrl from '@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2'
import faBrandsUrl from '@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2'


export const PreloadFonts = () => {
  return <Helmet>
    {preloadWOFF(faSolidUrl)}
    {preloadWOFF(faRegularUrl)}
    {preloadWOFF(faBrandsUrl)}
  </Helmet>
}

function Icon(props) {
  const { name, type = `solid`, className = ``, ...restProps } = props
  return <i className={`fa-${type} fa-${name} ${className}`} {...restProps} />
}

export default Icon
