import React from 'react'
import { formatDate,formatTime,getDaysUntil,extractDate } from '../utils/hikeDates'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import BookmarkButton from './BookmarkButton'

const HikeItem=({data, onClick, type})=> {

    const StartdateHandle= extractDate(data.startdate);

  return (   
            <div key={data.hikeid} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all relative group" onClick={onClick}>
                
                {type === "complete" && (
                  <div className="absolute top-5 right-25 z-30">
                    <BookmarkButton hikeId={data.hikeid} size="small" />
                  </div>
                )}

                <div className="flex">
                  <div className="w-32 h-32 flex-shrink-0">
                    <img 
                      src={data.image|| 'https://images.unsplash.com/photo-1688602905494-5feda601966d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3NlbWl0ZSUyMGhhbGYlMjBkb21lJTIwdHJhaWx8ZW58MXx8fHwxNzU2MzI3MDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'} 
                      alt={data.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg pr-12"> 
                        {data.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        data.status === 'complete' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : data.status === 'planned'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {data.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {data.location}
                    </p>

                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(StartdateHandle.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(StartdateHandle.time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {data.hikinggroup?.members?.length || 
                         (Array.isArray(data.hikinggroup) ? data.hikinggroup.length : 
                          typeof data.hikinggroup === 'string' ? JSON.parse(data.hikinggroup)?.length || 1 : 1)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${
                        getDaysUntil(StartdateHandle.date) === 'Today' || getDaysUntil(StartdateHandle.date) === 'Tomorrow'
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                         {getDaysUntil(StartdateHandle.date)} 
                      </span>
                      <div className="flex gap-2">
                        <button className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm font-medium transition-colors">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>    
  )
}
export default HikeItem