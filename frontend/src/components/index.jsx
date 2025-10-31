import { Home, MessagesSquare, CalendarDays, Settings, BookmarkMinus, MapPin, LogOut, Trophy } from "lucide-react";



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
                label: "Bookmarks",
                icon: BookmarkMinus,
                path: "/dashboard/Bookmarks",
            },
            {
                label: "View Current Hike",
                icon: MapPin,
                path: "/dashboard/View_Hike",
            },
            {
                label: "Leaderboard",
                icon: Trophy,
                path: "/dashboard/Leaderboard",
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