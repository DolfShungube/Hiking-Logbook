

import { createBrowserRouter,} from "react-router-dom";
import App from "../App";
import Welcome from "../pages/Welcome";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp"
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[

        {
           path: "/", 
           element: <Welcome/>,
        },
        {
            path:"/login",
            element: <SignIn/>,
        },
        {
            path:"/signup",
            element: <SignUp/>,
        },


        {
            path:"/dashboard",
            element: (<PrivateRoute>
                    <h1>users dashboard</h1>,
                     </PrivateRoute>)

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