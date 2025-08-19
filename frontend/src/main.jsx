import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from "/src/context/theme-context.jsx";

import SignInPage from "./pages/SignIn.jsx";
import App from "./App.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <ThemeProvider storageKey="theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthContextProvider>
  </StrictMode>,
)