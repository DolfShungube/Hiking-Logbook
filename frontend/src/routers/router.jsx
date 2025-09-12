import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Welcome from "../pages/Welcome";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import PrivateRoute from "./PrivateRoute";
import Layout from "./layout.jsx"; // Dashboard layout with sidebar
import DashboardPage from "../pages/page";
import HikeCollectionPage from "../pages/HikeCollectionPage.jsx";
import PlanHike from "../pages/PlanHike.jsx";
import CreateHike from "../pages/CreateHike.jsx";
import HikeCreatedPage from "../pages/HikeCreated.jsx";
import HikeLogbookPage from "../pages/logBook.jsx";
import Current from "../pages/current.jsx";//Make sure the filename matches exactly
import SettingsPage  from "../pages/Settings.jsx";  
import ChatFriendsPage  from  "../pages/Chats.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Welcome />,
      },
      {
        path: "/login",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/planning",
        element: <h1>Planning Page</h1>,
      },
      {
        path: "/profile",
        element: <h1>User Profile</h1>,
      },
      {
        path: "/myhikes",
        element: <HikeCollectionPage />,
      },
      {
        path: "/current/:hikeid",
        element: <Current />, // Fixed capitalization
      },
      {
        path: "/logentry/:hikeid",
        element: <HikeLogbookPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "Calendar",
        element: <PlanHike />,
      },
      {
        path: "CreateHike",
        element: <CreateHike />,
      },
      {
        path: "HikeCreated",
        element: <HikeCreatedPage />,
      },
      {
        path: "Bookings",
        element: <h1 className="title">Bookings</h1>,
      },
      {
        path: "Chats",
        element: <ChatFriendsPage />
      },
      {
        path: "View_Hike",
        element: <HikeCollectionPage/>,
      },
      {
        path: "Settings",
        element: <SettingsPage />
      },
    ],
  },
]);

export default router;
