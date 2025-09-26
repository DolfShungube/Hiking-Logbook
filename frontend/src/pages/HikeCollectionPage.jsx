

import React, { useState } from 'react';
import { 
  Mountain, 
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Compass,
  Camera,
  Heart,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import HikeCollection from '../components/hikeCollection';


const HikeCollectionPage = () => {


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


      <div className="max-w-6xl mx-auto px-6">
       

 <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Your Current Hike
                </h2>

              </div>
            </div>

           <HikeCollection type={"current"}/>

          <div className="py-16 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Your Completed Hikes
                </h2>

              </div>
              <button className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

              <HikeCollection type={"complete"}/>
            
          </div>


      </div>
    </div>
  );
};

export default HikeCollectionPage;
