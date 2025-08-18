import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles.css'
import { HashRouter } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { AppProvider } from './context/AppProvider'
import { AuthProvider } from './timeTrack/context/AuthContext'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter future={{ v7_startTransition: true }} >
      <AppProvider>
    <AuthProvider>
        <MainPage />
    </AuthProvider>
      </AppProvider>
    </HashRouter>
  </React.StrictMode>,
)
