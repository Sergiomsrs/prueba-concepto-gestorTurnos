import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles.css'
import { Daily } from './Daily'
import { MainPage } from './MainPage'
import { BrowserRouter } from 'react-router-dom'
//import { JobHourApp } from './JobHourApp'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <MainPage />
    </BrowserRouter>
  </React.StrictMode>,
)
