import { createRoot } from 'react-dom/client'
import React from 'react'
import { createHashRouter } from 'react-router-dom'

import App from './index'
import routes from 'ROUTES_PATH'

const container = document.getElementById('app')
const root = createRoot(container)
const router = createHashRouter(routes)
root.render(<App router={router} />)
