import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles.css'
import { Daily } from './Daily'

import { BrowserRouter } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
//import { JobHourApp } from './JobHourApp'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <MainPage />
    </BrowserRouter>
  </React.StrictMode>,
)
