import React from 'react'
import { useState } from 'react';
import { formatDate, formatTime, getDaysUntil, extractDate } from '../utils/hikeDates'
import { Calendar, Clock, MapPin, Users, Mountain } from 'lucide-react'

// Image with Fallback Component
const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
        <Mountain className="h-8 w-8 text-gray-400" />
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

const RecentHikeItem = ({ data, routes, onClick }) => {
  const EnddateHandle = formatDate(data.enddate);

  return (
    <div 
      key={data.hikeid} 
      onClick={() => onClick && onClick(data)}
      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all cursor-pointer group w-full"
    >
      <ImageWithFallback
        src={data.image || "https://images.unsplash.com/photo-1623622863859-2931a6c3bc80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"}
        alt={data.title}
        className="w-16 h-16 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow"
      />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{data.title}</p>
        <p className="text-sm text-gray-600 mt-1">{EnddateHandle}</p>
      </div>
      <div className="text-right text-sm">
        <p className="font-bold text-gray-900">{data.distance} km</p>
        <p className="text-gray-600">{data.duration || "5h 15m"}</p>
      </div>
    </div>
  );
};



export default RecentHikeItem;
