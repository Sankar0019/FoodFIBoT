import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ActivityProvider } from './contexts/ActivityContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DrinkingTab from './components/DrinkingTab';
import EnhancedChatBot from './components/EnhancedChatBot';
import LoginScreen from './components/LoginScreen';
import SmartNotificationSystem from './components/SmartNotificationSystem';
import ActivityMonitor from './components/ActivityMonitor';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab}>
        <SmartNotificationSystem />
      </Header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <ActivityMonitor />
        </div>
        
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'drinking' && <DrinkingTab />}
      </main>

      <EnhancedChatBot />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <AppContent />
      </ActivityProvider>
    </AuthProvider>
  );
}

export default App;