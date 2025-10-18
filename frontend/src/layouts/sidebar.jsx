import React, { forwardRef } from 'react';
import logo from '/src/assets/mountains.png';
import { cn } from '/src/utils/cn.js';
import { navbarLinks } from '../components/index.jsx';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from "lucide-react";
import { UserAuth } from '../context/AuthContext';

const Sidebar = forwardRef(({ collapsed }, ref) => {
  const { signOutUser } = UserAuth();
  const navigate = useNavigate();

  const handleGooglesignInUser = async () => {
    try {
      await signOutUser();
      navigate("/login"); // make sure it matches your router path
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex flex-col h-full w-[240px] overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      {/* Logo */}
      <div className="p-3 flex items-start">
        <img src={logo} alt="Logo" className="w-10 h-10" />
        {!collapsed && (
          <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">
            Trailo
          </p>
        )}
      </div>

      {/* Sidebar links */}
      <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-hidden p-3 [scrollbar-width:_thin]">
        {navbarLinks.map((navbarLink) => (
          <nav
            key={navbarLink.title}
            className={cn("sidebar-group", collapsed && "md:items-center")}
          >
            {!collapsed && (
                <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>
                {navbarLink.title}
            </p>
            )}

            {navbarLink.links.map((link) => {
              const makeExact = link.path === "/dashboard" || link.path === "/";
              return (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={makeExact}
                  className={({ isActive }) =>
                    cn(
                      "sidebar-item",
                      collapsed && "md:w-[45px]",
                      isActive && "active"
                    )
                  }
                >
                  <link.icon size={22} className="flex-shrink-0" />
                  {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                </NavLink>
              );
            })}
          </nav>
        ))}
      </div>

      {/* Logout button at bottom */}
      <div className="mt-auto p-3">
        <button
          onClick={handleGooglesignInUser}
          className="flex items-center gap-2 p-2 rounded-lg bg-transparent hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700 transition w-full"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};

export default Sidebar;
