import React, { useState } from 'react';
import { 
  User,
  ChevronRight,
  Shield,
  Globe,
  CreditCard,
  HelpCircle,
  LogOut,
  Edit3,
  Bell,
  MapPin,
  MessageSquare,
  Mountain,
  Settings
} from 'lucide-react';
import { UserAuth } from "../context/AuthContext.jsx";

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const {session,currentUser}= UserAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Settings className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                Settings <Mountain className="w-8 h-8" />
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your hiking app preferences</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  {currentUser?.userName ? (<h3 className="title">{currentUser.userName}</h3>) : (<p className="title">Loading...</p>)}
                  <p className="text-gray-500 dark:text-gray-400">Adventure Enthusiast</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentUser.email}</p>
                </div>
                <button className="p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <Edit3 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h3>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <button className="w-full p-6 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <User className="text-blue-500 dark:text-blue-400" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Personal Information</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your profile details</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 dark:text-gray-500" size={20} />
              </button>
              
              <button className="w-full p-6 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Shield className="text-green-500 dark:text-green-400" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Privacy & Security</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your privacy settings</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 dark:text-gray-500" size={20} />
              </button>
              
              <button className="w-full p-6 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-purple-500 dark:text-purple-400" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Billing & Payments</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage subscription and payments</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 dark:text-gray-500" size={20} />
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h3>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <Bell className="text-yellow-500 dark:text-yellow-400" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get updates about your hikes</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 shadow-sm ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <MapPin className="text-red-500 dark:text-red-400" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Location Services</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Help find nearby trails</p>
                  </div>
                </div>
                <button 
                  onClick={() => setLocationEnabled(!locationEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    locationEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 shadow-sm ${
                    locationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <button className="w-full p-6 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <Globe className="text-indigo-500 dark:text-indigo-400" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Language & Region</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">English (US)</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 dark:text-gray-500" size={20} />
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Support</h3>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <button className="w-full p-6 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                    <HelpCircle className="text-cyan-500 dark:text-cyan-400" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Help Center</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get answers to common questions</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 dark:text-gray-500" size={20} />
              </button>
              
              <button className="w-full p-6 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <MessageSquare className="text-orange-500 dark:text-orange-400" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Contact Support</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reach out for help</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 dark:text-gray-500" size={20} />
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <button className="w-full p-6 flex items-center space-x-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 rounded-xl">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <LogOut className="text-red-500 dark:text-red-400" size={20} />
              </div>
              <p className="font-medium">Sign Out</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;