import React, { useEffect, useState } from 'react';
import { X, Droplets, Target, TrendingUp, Clock } from 'lucide-react';

interface NotificationProps {
  notification: {
    message: string;
    type: 'suggestion' | 'reminder' | 'achievement';
  };
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);

    // Auto-close after 8 seconds with progress bar
    const duration = 8000;
    const interval = 50;
    const decrement = 100 / (duration / interval);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - decrement;
        if (newProgress <= 0) {
          clearInterval(progressTimer);
          handleClose();
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'suggestion':
        return <Droplets className="w-6 h-6 text-blue-500" />;
      case 'reminder':
        return <Clock className="w-6 h-6 text-orange-500" />;
      case 'achievement':
        return <Target className="w-6 h-6 text-green-500" />;
      default:
        return <TrendingUp className="w-6 h-6 text-purple-500" />;
    }
  };

  const getGradientClass = () => {
    switch (notification.type) {
      case 'suggestion':
        return 'from-blue-500 to-cyan-500';
      case 'reminder':
        return 'from-orange-500 to-red-500';
      case 'achievement':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div className={`fixed top-6 right-6 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 max-w-sm w-80 relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1">
          <div 
            className={`h-full bg-gradient-to-r ${getGradientClass()} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-3 mt-1">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <span className="font-semibold text-gray-800">
              {notification.type === 'suggestion' ? 'Smart Suggestion' :
               notification.type === 'reminder' ? 'Hydration Reminder' :
               'Achievement'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {notification.message}
        </p>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <button 
            onClick={handleClose}
            className={`flex-1 bg-gradient-to-r ${getGradientClass()} text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 hover:scale-105`}
          >
            Got it!
          </button>
          <button 
            onClick={handleClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Later
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-lg"></div>
      </div>
    </div>
  );
};

export default NotificationPopup;