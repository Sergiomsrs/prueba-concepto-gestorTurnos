import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles.css'
import { Daily } from './Daily'

import { BrowserRouter } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { AppProvider } from './context/AppProvider'
//import { JobHourApp } from './JobHourApp'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <MainPage />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
