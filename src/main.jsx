import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from './context/ThemeContext'
import './styles/theme.css'
import './styles/admin.css'
import './styles/auth.css'
import './styles/client.css'
import './styles/landing.css'
import './index.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '986941539016-trl8j3nic5vq04htn9u7q0sqda626oa4.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
