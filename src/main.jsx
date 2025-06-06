import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Styling/index.css'
import App from './App.jsx'
import { FirebaseProvider } from './Context/fireBaseContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FirebaseProvider>
    <App />
    </FirebaseProvider>
  </StrictMode>,
)
