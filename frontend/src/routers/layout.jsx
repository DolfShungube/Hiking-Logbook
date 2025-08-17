import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '/src/layouts/sidebar.jsx';
import { useMediaQuery } from '@uidotdev/usehooks';
import { cn } from '/src/utils/cn.js';
import Header from '/src/layouts/header.jsx';
import { Outlet } from 'react-router-dom';
import {useClickOutside} from '/src/hooks/use-click-outside.jsx';


const Layout = () => {
  const isDesktopDevice = useMediaQuery('(max-width: 768px)');
   const [collapsed, setCollapsed] = useState(!isDesktopDevice);
   const sidebarRef = useRef(null);

  useEffect(() => { 
    setCollapsed(!isDesktopDevice);

  }, [isDesktopDevice]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktopDevice && !collapsed) {
      setCollapsed(true);
    }

  });

  return (
    <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">

    <div className={cn("pointer-events-none fixed inset-0 z-10 bg-black opacity-0 transition-opacity",
      !collapsed && "max-md: pointer-events-auto max-md:opacity-30"
    )} />
    <Sidebar 
    ref = {sidebarRef} collapsed={collapsed}/>
    <div className={cn("transtion-[margin] duration-300", collapsed ? "ml-[70px]" : "ml-[240px]")}>
      <Header collapsed= {collapsed}
        setCollapsed= {setCollapsed} />
      <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">

        <Outlet />
      </div>
    </div>
    </div>
  )
}

export default Layout
