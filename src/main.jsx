import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles.css'
import './styles-zoom.css'
import { HashRouter } from 'react-router-dom'
import { MainPage } from './pages/MainPage.jsx'
import { AppProvider } from './context/AppProvider'
import { AuthProvider } from './timeTrack/context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // No reintentar si falla (comportamiento estándar de fetch)
      refetchOnWindowFocus: false, // No pedir datos de nuevo al cambiar de pestaña
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter future={{ v7_startTransition: true }} >
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AuthProvider>
            <MainPage />
          </AuthProvider>
        </AppProvider>
      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>,
)
