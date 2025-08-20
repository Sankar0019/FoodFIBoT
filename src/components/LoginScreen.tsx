import React from 'react';
import { Droplets, TrendingUp, Smartphone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();

  const handleGoogleLogin = () => {
    // Simulate Google login - in a real app, this would integrate with Google OAuth
    const mockUser = {
      id: '1',
      name: 'Demo User',
      email: 'demo@foodfibot.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150&h=150&fit=crop&crop=face'
    };
    login(mockUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full transform hover:scale-105 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            FOOD FIBOT
          </h1>
          <p className="text-gray-600 mt-2">Smart Health Drink Tracker</p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Droplets className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Smart Suggestions</h3>
              <p className="text-sm text-gray-600">AI-powered drink recommendations</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Track Progress</h3>
              <p className="text-sm text-gray-600">Monitor hydration & expenses</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Smart Notifications</h3>
              <p className="text-sm text-gray-600">Personalized health reminders</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;