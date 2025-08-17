import { Home, MessagesSquare, CalendarDays, Settings,BookmarkMinus, MapPin } from "lucide-react";



export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/dashboard",
            },
            {
                label: "Calendar",
                icon: CalendarDays,
                path: "/dashboard/Calendar",
            },
            {
                label: "Bookings",
                icon: BookmarkMinus,
                path: "/dashboard/Bookings",
            },
            {
                label: "Chats",
                icon: MessagesSquare,
                path: "/dashboard/Chats",
            },
            {
                label: "View Current Hike",
                icon:MapPin,
                path: "/dashboard/View_Hike",
            },



        ],
    },
    {
      
        title: "Settings",
        links: [
            {
                label: "Settings",
                icon: Settings,
                path: "/dashboard/Settings",
            },
        ],
    },
];