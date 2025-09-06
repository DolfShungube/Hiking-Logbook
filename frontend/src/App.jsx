import { Outlet } from 'react-router-dom'
import { HikeDataContextProvider } from './context/hikeDataContext.jsx';
import './App.css'


function App() {


  return (
    <>
     <HikeDataContextProvider>
        <main>
          <Outlet/>
        </main>
     </HikeDataContextProvider>
     
      
    </>
  )
}

export default App


