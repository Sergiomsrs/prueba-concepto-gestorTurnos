import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles.css'
import { JobHourApp } from './JobHourApp'
import { Daily } from './Daily'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Daily />
  </React.StrictMode>,
)
