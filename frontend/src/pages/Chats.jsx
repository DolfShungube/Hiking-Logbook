import React, { useState } from 'react';
import {
  MessageCircle,
  Search,
  MoreVertical,
  Phone,
  Video,
  Send,
  Smile,
  Paperclip,
  Users,
  MapPin,
  Mountain,
  Clock,
  CheckCheck,
  Check,
  Plus,
  Filter,
  Star,
  Camera
} from 'lucide-react';

const ChatFriendsPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for friends and chats
  const friends = [
    {
      id: 1,
      name: 'Albert Flores',
      avatar: 'AF',
      status: 'online',
      lastMessage: "Ready for tomorrow's hike?",
      time: '10:15',
      unread: 2,
      isActive: true,
      location: 'Table Mountain',
      lastSeen: 'now'
    },
    {
      id: 2,
      name: 'Marvin Kay',
      avatar: 'MK',
      status: 'online',
      lastMessage: 'The trail photos are amazing!',
      time: '09:50',
      unread: 0,
      isActive: false,
      location: 'Drakensberg',
      lastSeen: '2 min ago'
    },
    {
      id: 3,
      name: 'Guy Hawkins',
      avatar: 'GH',
      status: 'online',
      lastMessage: 'Thanks for the trail recommendation',
      time: '08:30',
      unread: 0,
      isActive: false,
      location: 'Lion\'s Head',
      lastSeen: '5 min ago'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      avatar: 'SW',
      status: 'offline',
      lastMessage: 'See you at the weekend hike!',
      time: 'Yesterday',
      unread: 0,
      isActive: false,
      location: 'Kirstenbosch',
      lastSeen: '2 hours ago'
    },
    {
      id: 5,
      name: 'Mike Johnson',
      avatar: 'MJ',
      status: 'offline',
      lastMessage: 'Great hiking session today',
      time: 'Yesterday',
      unread: 1,
      isActive: false,
      location: 'Chapman\'s Peak',
      lastSeen: '1 day ago'
    }
  ];

  const currentChat = selectedChat ? friends.find(f => f.id === selectedChat) : friends[0];

  const chatMessages = [
    {
      id: 1,
      sender: 'them',
      message: "Hey! How was your hike at Lion's Head yesterday?",
      time: '09:45',
      status: 'read'
    },
    {
      id: 2,
      sender: 'me',
      message: "It was incredible! The sunrise view was absolutely breathtaking 🌅",
      time: '09:47',
      status: 'read'
    },
    {
      id: 3,
      sender: 'me',
      message: "I got some amazing photos too. Want to see them?",
      time: '09:47',
      status: 'read'
    },
    {
      id: 4,
      sender: 'them',
      message: "Absolutely! I love seeing trail photography",
      time: '09:50',
      status: 'read'
    },
    {
      id: 5,
      sender: 'them',
      message: "Ready for tomorrow's hike?",
      time: '10:15',
      status: 'delivered'
    }
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      setMessage('');
    }
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-green-500' : 'bg-gray-400';
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-indigo-600',
      'bg-gradient-to-br from-green-500 to-emerald-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
      'bg-gradient-to-br from-cyan-500 to-blue-600'
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <MessageCircle className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                Chat Friends <Mountain className="w-8 h-8" />
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Connect with your hiking buddies</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Friends List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Search Header */}
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Messages
                </h2>
                <button className="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <Plus className="text-blue-500" size={20} />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Friends List */}
            <div className="overflow-y-auto flex-1 max-h-96">
              {filteredFriends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => setSelectedChat(friend.id)}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-all border-l-4 ${
                    selectedChat === friend.id || (!selectedChat && friend.id === 1)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="relative">
                    <div className={`w-12 h-12 ${getAvatarColor(friend.name)} rounded-full flex items-center justify-center shadow-md`}>
                      <span className="text-white font-semibold text-sm">{friend.avatar}</span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{friend.name}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{friend.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{friend.lastMessage}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="text-gray-400" size={12} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{friend.location}</span>
                    </div>
                  </div>
                  {friend.unread > 0 && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{friend.unread}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-12 h-12 ${getAvatarColor(currentChat.name)} rounded-full flex items-center justify-center shadow-md`}>
                    <span className="text-white font-semibold">{currentChat.avatar}</span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(currentChat.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{currentChat.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={12} />
                    <span>{currentChat.location}</span>
                    <span>•</span>
                    <span>Last seen {currentChat.lastSeen}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <Phone className="text-gray-600 dark:text-gray-400" size={20} />
                </button>
                <button className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <Video className="text-gray-600 dark:text-gray-400" size={20} />
                </button>
                <button className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <MoreVertical className="text-gray-600 dark:text-gray-400" size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-96 max-h-96">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.sender === 'me' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <div className={`flex items-center justify-end gap-1 mt-2 ${
                      msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <span className="text-xs">{msg.time}</span>
                      {msg.sender === 'me' && (
                        msg.status === 'read' ? 
                          <CheckCheck size={14} className="text-blue-200" /> :
                          <Check size={14} className="text-blue-200" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <Paperclip className="text-gray-500 dark:text-gray-400" size={20} />
                </button>
                <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <Camera className="text-gray-500 dark:text-gray-400" size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-700 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-600 transition-all pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <Smile size={20} />
                  </button>
                </div>
                <button 
                  onClick={sendMessage}
                  className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatFriendsPage;