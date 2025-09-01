import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SearchProvider } from './Contexts/SearchContext.jsx'
import AuthProvider from './Contexts/AuthContext.jsx';
import { FavoriteProvider } from './Contexts/FavoriteContext.jsx';
import { LoginProvider } from './Contexts/LoginContext.jsx';

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AuthProvider>
      <SearchProvider>
        <FavoriteProvider>
          <LoginProvider>
            <App />
          </LoginProvider>
        </FavoriteProvider>
      </SearchProvider>
    </AuthProvider>
  </BrowserRouter>,
)