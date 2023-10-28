import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router-dom'

import App from '../app'
import routes from 'ROUTES_PATH'

const container = document.getElementById('app')
const router = createBrowserRouter(routes)
hydrateRoot(container, <App router={router} />)
