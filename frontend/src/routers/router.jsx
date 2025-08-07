

import { createBrowserRouter,} from "react-router-dom";
import App from "../App";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[

        {
           path: "/", 
           element: <h1>home page</h1>,
        },
        {
            path:"/login",
            element: <h1>login page</h1>,
        },
        {
            path:"/dashboard",
            element: <h1>users dashboard</h1>,

        },
        {
             path:"/planning",
            element: <h1>plannig page</h1>,

        },
        {
             path:"/profile",
            element: <h1>user profile</h1>,

        }        

     
    ]
  },
]);


export default router;