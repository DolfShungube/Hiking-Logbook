import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from "/src/context/theme-context.jsx";

import SignInPage from "./pages/SignIn.jsx";
import App from "./App.jsx";
import {HikeDataContextProvider} from './context/hikeDataContext.jsx'
import { GoalDataCollection, GoalDataContextProvider } from './context/GoalsContext.jsx'
import { NotesDataContextProvider } from './context/NotesContext.jsx'
import { UserDataContextProvider } from './context/UsersContext.jsx'
import { RouteDataContextProvider } from './context/MapRoutesContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      
      <UserDataContextProvider>
      <NotesDataContextProvider>
      <GoalDataContextProvider>
      <HikeDataContextProvider>
      <RouteDataContextProvider>
      <ThemeProvider storageKey="theme">
        <RouterProvider router={router} />
      </ThemeProvider>
      </RouteDataContextProvider>
      </HikeDataContextProvider>
      </GoalDataContextProvider>
      </NotesDataContextProvider>
      </UserDataContextProvider>

    </AuthContextProvider>
  </StrictMode>,
)