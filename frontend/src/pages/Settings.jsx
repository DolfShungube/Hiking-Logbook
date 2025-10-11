import React, { useState } from 'react';
import {
  User,
  ChevronRight,
  Globe,
  HelpCircle,
  LogOut,
  Edit3,
  Bell,
  MapPin,
  MessageSquare,
  Mountain,
  Settings,
  X,
  Send,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  CheckCircle
} from 'lucide-react';
import { UserAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SettingsPage = ({onLogout}) => {
  const Navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { currentUser, signOutUser } = UserAuth();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const languages = [
    'English (US)',
    'English (UK)',
    'Spanish (ES)',
    'French (FR)',
    'German (DE)',
    'Italian (IT)',
    'Portuguese (BR)',
    'Japanese (JP)',
    'Chinese (CN)',
    'Korean (KR)'
  ];

  const faqItems = [
    {
      id: 1,
      question: 'How do I plan a hiking trip?',
      answer: 'To plan a hiking trip, go to the Explore section, select your desired destination, and use our trip planning tools. You can add trails, set waypoints, and download offline maps for your adventure.'
    },
   
    {
      id: 2,
      question: 'Can I share my trails with friends?',
      answer: 'Yes! After completing a trail, you can share it via the share button. You can send it through social media, email, or generate a unique link that others can use to view your route and photos.'
    },
    {
      id: 3,
      question: 'How do I track my hiking statistics?',
      answer: 'Your hiking statistics are automatically tracked and available in your Profile section. You can view distance covered, elevation gained, time spent hiking, and more detailed analytics.'
    },
    {
      id: 4,
      question: 'What should I do if the app crashes?',
      answer: 'First, try restarting the app. If the problem persists, clear the app cache in your device settings. Make sure you have the latest version installed. If issues continue, contact our support team.'
    },
    {
      id: 5,
      question: 'How do I update my profile information?',
      answer: 'Go to Settings > Profile, and tap the edit icon. You can update your name, profile picture, bio, and other personal information. Changes are saved automatically.'
    }
  ];

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogoutClick = async () => {
    try{
      await signOutUser();
      Navigate("/login");
    }catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfile = async () => {
    Navigate("/profile");
  };

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    setShowLanguageModal(false);
  };

  const handleContactFormChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setFormSubmitted(false);
      setShowContactSupport(false);
    }, 2500);
  };

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
                {t('settings.title')} <Mountain className="w-8 h-8" />
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{t('settings.subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700 ">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('settings.profile')}
              </h3>
            </div>
            <div
              onClick={handleProfile}
              className="p-6 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md ">
                  <User className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  {currentUser?.userName ? (
                    <h3 className="font-semibold text-gray-900 dark:text-white">{currentUser.userName}</h3>
                  ) : (
                    <p className="font-semibold text-gray-900 dark:text-white">Loading...</p>
                  )}
                  <p className="text-gray-500 dark:text-gray-400">{t('settings.adventureEnthusiast')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentUser?.email}</p>
                </div>
                <button className="p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <Edit3 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.preferences')}</h3>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <Bell className="text-yellow-500 dark:text-yellow-400" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.notifications')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.notificationsDesc')}</p>
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
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.locationServices')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.locationDesc')}</p>
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
              
              <button
                onClick={() => setShowLanguageModal(true)}
                className="w-full p-6 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <Globe className="text-indigo-500 dark:text-indigo-400" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.languageRegion')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{currentLanguage}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 dark:text-gray-500" size={20} />
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.support')}</h3>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <button 
                onClick={() => setShowHelpCenter(true)}
                className="w-full p-6 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                    <HelpCircle className="text-cyan-500 dark:text-cyan-400" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.helpCenter')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.helpCenterDesc')}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 dark:text-gray-500" size={20} />
              </button>
              
              <button 
                onClick={() => setShowContactSupport(true)}
                className="w-full p-6 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <MessageSquare className="text-orange-500 dark:text-orange-400" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.contactSupport')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.contactSupportDesc')}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 dark:text-gray-500" size={20} />
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogoutClick}
              className="w-full p-6 flex items-center space-x-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 rounded-xl">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <LogOut className="text-red-500 dark:text-red-400" size={20} />
              </div>
              <p className="font-medium">{t('settings.signOut')}</p>
            </button>
          </div>
        </div>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.selectLanguage')}</h3>
                <button
                  onClick={() => setShowLanguageModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => handleLanguageChange(language)}
                  className={`w-full p-4 text-left hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between ${
                    currentLanguage === language ? 'bg-blue-50 dark:bg-gray-700/50' : ''
                  }`}
                >
                  <span className="text-gray-900 dark:text-white font-medium">{language}</span>
                  {currentLanguage === language && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help Center Modal */}
      {showHelpCenter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="text-cyan-500" size={28} />
                  {t('settings.helpCenter')}
                </h3>
                <button
                  onClick={() => setShowHelpCenter(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-3">
                {filteredFAQs.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="font-medium text-gray-900 dark:text-white text-left">{item.question}</span>
                      {expandedFAQ === item.id ? (
                        <ChevronUp className="text-blue-500 flex-shrink-0 ml-2" size={20} />
                      ) : (
                        <ChevronDown className="text-gray-400 flex-shrink-0 ml-2" size={20} />
                      )}
                    </button>
                    {expandedFAQ === item.id && (
                      <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-600 pt-4">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
                {filteredFAQs.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No matching FAQs found. Try contacting support for personalized help.
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Can't find what you're looking for?</p>
              <button
                onClick={() => {
                  setShowHelpCenter(false);
                  setShowContactSupport(true);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                {t('settings.contactSupport')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {showContactSupport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="text-orange-500" size={28} />
                  {t('settings.contactSupport')}
                </h3>
                <button
                  onClick={() => {
                    setShowContactSupport(false);
                    setFormSubmitted(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h4>
                  <p className="text-gray-600 dark:text-gray-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <div>
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="text-blue-500" size={20} />
                        <span className="font-medium text-gray-900 dark:text-white">Email</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">support@trailapp.com</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="text-green-500" size={20} />
                        <span className="font-medium text-gray-900 dark:text-white">Phone</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactFormChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactFormChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactFormChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="What can we help you with?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactFormChange}
                        rows="5"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Please describe your issue in detail..."
                      />
                    </div>

                    <button
                      onClick={handleContactFormSubmit}
                      disabled={!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message}
                      className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={20} />
                      Send Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;