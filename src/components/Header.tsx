import React from 'react';
import { Droplets, BarChart3, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, children }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                FOOD FIBOT
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('drinking')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'drinking'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>Drinking Tab</span>
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                {children}
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-8 h-8 text-gray-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('drinking')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'drinking'
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Drinks</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;