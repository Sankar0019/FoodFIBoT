import React, { useState, useEffect } from 'react';
import { Activity, Heart, Moon, MapPin, Thermometer, Droplets, Zap } from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';

const ActivityMonitor: React.FC = () => {
  const { activityData, updateActivity, getActivityScore } = useActivity();
  const [isExpanded, setIsExpanded] = useState(false);
  const activityScore = getActivityScore();

  // Simulate sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const currentHour = new Date().getHours();
      
      // Simulate realistic activity patterns
      if (currentHour >= 7 && currentHour <= 22) {
        updateActivity({
          steps: activityData.steps + Math.floor(Math.random() * 30),
          heartRate: 70 + Math.floor(Math.random() * 20),
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activityData.steps]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return { status: 'Low', color: 'text-blue-600' };
    if (hr <= 100) return { status: 'Normal', color: 'text-green-600' };
    if (hr <= 120) return { status: 'Elevated', color: 'text-yellow-600' };
    return { status: 'High', color: 'text-red-600' };
  };

  const heartRateStatus = getHeartRateStatus(activityData.heartRate);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getScoreColor(activityScore)}`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Activity Monitor</h3>
              <p className="text-sm text-gray-600">Health Score: {activityScore}/100</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{activityData.steps.toLocaleString()}</p>
              <p className="text-xs text-gray-500">steps</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${heartRateStatus.color}`}>{activityData.heartRate}</p>
              <p className="text-xs text-gray-500">bpm</p>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Heart Rate</span>
              </div>
              <p className="text-lg font-bold text-blue-900">{activityData.heartRate} bpm</p>
              <p className={`text-xs ${heartRateStatus.color}`}>{heartRateStatus.status}</p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Moon className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Sleep</span>
              </div>
              <p className="text-lg font-bold text-green-900">{activityData.sleepHours}h</p>
              <p className="text-xs text-green-600">
                {activityData.sleepHours >= 7 ? 'Good' : 'Need more'}
              </p>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Hydration</span>
              </div>
              <p className="text-lg font-bold text-purple-900">{activityData.waterIntake}ml</p>
              <p className="text-xs text-purple-600">
                {activityData.waterIntake >= 2000 ? 'Optimal' : 'Low'}
              </p>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Exercise</span>
              </div>
              <p className="text-lg font-bold text-orange-900">{activityData.workoutMinutes}min</p>
              <p className="text-xs text-orange-600">
                {activityData.workoutMinutes >= 30 ? 'Great!' : 'More needed'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Location</span>
              </div>
              <p className="font-medium text-gray-800 capitalize">{activityData.location}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Thermometer className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Weather</span>
              </div>
              <p className="font-medium text-gray-800 capitalize">{activityData.weather}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Activity className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Stress</span>
              </div>
              <p className={`font-medium capitalize ${
                activityData.stressLevel === 'low' ? 'text-green-600' :
                activityData.stressLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {activityData.stressLevel}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Quick Actions</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => updateActivity({ workoutMinutes: activityData.workoutMinutes + 30 })}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                Log Workout
              </button>
              <button 
                onClick={() => updateActivity({ waterIntake: activityData.waterIntake + 250 })}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                +250ml Water
              </button>
              <button 
                onClick={() => updateActivity({ lastMeal: new Date() })}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
              >
                Log Meal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityMonitor;