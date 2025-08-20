import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';

interface SmartNotification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'suggestion' | 'reminder' | 'achievement';
  drinkSuggestion?: {
    name: string;
    cost: number;
    benefits: string[];
  };
  timestamp: Date;
  priority: number;
}

const SmartNotificationSystem: React.FC = () => {
  const { activityData, getDrinkSuggestion, getActivityScore } = useActivity();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const checkAndCreateNotifications = () => {
      const currentHour = new Date().getHours();
      const suggestion = getDrinkSuggestion();
      const score = getActivityScore();

      // Clear old notifications (older than 1 hour)
      setNotifications(prev => 
        prev.filter(n => Date.now() - n.timestamp.getTime() < 3600000)
      );

      // Urgent hydration alert
      if (activityData.waterIntake < 500 && currentHour > 10) {
        addNotification({
          title: '🚨 Hydration Alert',
          message: 'You\'ve only had ' + activityData.waterIntake + 'ml of water today. Risk of dehydration!',
          type: 'urgent',
          drinkSuggestion: {
            name: suggestion.drink,
            cost: suggestion.cost,
            benefits: suggestion.benefits
          },
          priority: 10
        });
      }

      // Workout recovery notification
      if (activityData.heartRate > 100 && activityData.workoutMinutes > 0) {
        addNotification({
          title: '💪 Post-Workout Recovery',
          message: 'Great workout! Your heart rate is elevated. Time for recovery hydration.',
          type: 'suggestion',
          drinkSuggestion: {
            name: suggestion.drink,
            cost: suggestion.cost,
            benefits: suggestion.benefits
          },
          priority: 8
        });
      }

      // Stress management
      if (activityData.stressLevel === 'high') {
        addNotification({
          title: '🧘 Stress Management',
          message: 'High stress levels detected. Consider a calming drink to help you relax.',
          type: 'suggestion',
          drinkSuggestion: {
            name: 'Chamomile Tea with Honey',
            cost: 18,
            benefits: ['Stress relief', 'Better sleep', 'Antioxidants']
          },
          priority: 7
        });
      }

      // Achievement notifications
      if (score >= 80) {
        addNotification({
          title: '🏆 Health Achievement',
          message: `Excellent! Your health score is ${score}/100. You're crushing your wellness goals!`,
          type: 'achievement',
          priority: 5
        });
      }

      // Time-based reminders
      if (currentHour === 7 && !hasRecentNotification('morning')) {
        addNotification({
          title: '🌅 Good Morning',
          message: 'Start your day right with a metabolism-boosting drink!',
          type: 'reminder',
          drinkSuggestion: {
            name: 'Warm Lemon Water',
            cost: 8,
            benefits: ['Metabolism boost', 'Detox', 'Vitamin C']
          },
          priority: 6
        });
      }

      if (currentHour === 15 && !hasRecentNotification('afternoon')) {
        addNotification({
          title: '☀️ Afternoon Energy',
          message: 'Beat the afternoon slump with a healthy energy drink!',
          type: 'reminder',
          drinkSuggestion: {
            name: suggestion.drink,
            cost: suggestion.cost,
            benefits: suggestion.benefits
          },
          priority: 4
        });
      }
    };

    const interval = setInterval(checkAndCreateNotifications, 30000); // Check every 30 seconds
    checkAndCreateNotifications(); // Initial check

    return () => clearInterval(interval);
  }, [activityData, getDrinkSuggestion, getActivityScore]);

  const addNotification = (notification: Omit<SmartNotification, 'id' | 'timestamp'>) => {
    const newNotification: SmartNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setNotifications(prev => {
      // Avoid duplicate notifications
      const exists = prev.some(n => 
        n.title === newNotification.title && 
        Date.now() - n.timestamp.getTime() < 300000 // 5 minutes
      );
      
      if (exists) return prev;
      
      // Sort by priority and keep only top 5
      return [...prev, newNotification]
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 5);
    });
  };

  const hasRecentNotification = (type: string): boolean => {
    return notifications.some(n => 
      n.title.toLowerCase().includes(type) && 
      Date.now() - n.timestamp.getTime() < 3600000 // 1 hour
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'suggestion': return <Target className="w-5 h-5 text-blue-500" />;
      case 'reminder': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'achievement': return <TrendingUp className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'suggestion': return 'border-l-blue-500 bg-blue-50';
      case 'reminder': return 'border-l-yellow-500 bg-yellow-50';
      case 'achievement': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const urgentNotifications = notifications.filter(n => n.type === 'urgent');

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <Bell className="w-5 h-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {showPanel && (
          <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Smart Notifications</h3>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications right now</p>
                  <p className="text-sm">We'll notify you with smart suggestions!</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border-l-4 ${getNotificationColor(notification.type)} relative group`}
                    >
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {notification.message}
                          </p>

                          {notification.drinkSuggestion && (
                            <div className="mt-2 p-2 bg-white rounded-lg border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm text-gray-800">
                                  {notification.drinkSuggestion.name}
                                </span>
                                <span className="text-green-600 font-medium text-sm">
                                  ₹{notification.drinkSuggestion.cost}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {notification.drinkSuggestion.benefits.slice(0, 2).map((benefit, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                  >
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                              <button className="w-full mt-2 bg-gradient-to-r from-green-500 to-blue-500 text-white py-1 px-3 rounded-lg text-sm hover:shadow-lg transition-all duration-200">
                                Add to Plan
                              </button>
                            </div>
                          )}

                          <p className="text-xs text-gray-400 mt-2">
                            {notification.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Urgent Notification Overlay */}
      {urgentNotifications.map((notification) => (
        <div
          key={notification.id}
          className="fixed top-20 right-6 z-50 bg-red-500 text-white p-4 rounded-xl shadow-2xl max-w-sm animate-bounce"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold">{notification.title}</h4>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-white hover:text-red-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm mb-3">{notification.message}</p>
          {notification.drinkSuggestion && (
            <button className="w-full bg-white text-red-500 py-2 px-4 rounded-lg font-medium hover:bg-red-50 transition-colors">
              Try {notification.drinkSuggestion.name}
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default SmartNotificationSystem;