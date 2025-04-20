
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider as UIThemeProvider } from "./components/ui/theme-provider"
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext'
import App from './App'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <UIThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <CustomThemeProvider>
          <App />
        </CustomThemeProvider>
      </UIThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
