import React from 'react';
import { Droplets, TrendingUp, Target, DollarSign, Clock, Award } from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';

const Dashboard: React.FC = () => {
  const { activityData, getActivityScore } = useActivity();
  const healthScore = getActivityScore();
  
  const stats = [
    {
      title: 'Water Intake',
      value: `${(activityData.waterIntake / 1000).toFixed(1)}L`,
      target: '2.5L',
      percentage: Math.min((activityData.waterIntake / 2500) * 100, 100),
      icon: Droplets,
      color: 'blue',
      trend: activityData.waterIntake > 1500 ? '+15%' : '-5%'
    },
    {
      title: 'Health Drinks',
      value: '3',
      target: '4',
      percentage: 75,
      icon: Target,
      color: 'green',
      trend: '+20%'
    },
    {
      title: 'Daily Spend',
      value: '₹85',
      target: '₹100',
      percentage: 85,
      icon: DollarSign,
      color: 'purple',
      trend: '-5%'
    },
    {
      title: 'Hydration Score',
      value: (healthScore / 10).toFixed(1),
      target: '10',
      percentage: healthScore,
      icon: Award,
      color: 'orange',
      trend: healthScore > 70 ? '+12%' : '-8%'
    }
  ];

  const todaysDrinks = [
    { time: '07:30 AM', drink: 'Warm Lemon Water', calories: 20, cost: 5, status: 'completed' },
    { time: '10:00 AM', drink: 'Green Tea', calories: 2, cost: 15, status: 'completed' },
    { time: '12:30 PM', drink: 'Coconut Water', calories: 45, cost: 25, status: 'pending' },
    { time: '03:00 PM', drink: 'Protein Shake', calories: 120, cost: 40, status: 'pending' },
    { time: '06:00 PM', drink: 'Herbal Tea', calories: 5, cost: 10, status: 'pending' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Good Morning! 🌅</h2>
        <p className="opacity-90">
          You're doing great! Keep up with your hydration goals today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">{stat.trend}</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <div className="flex items-end space-x-2 mb-3">
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                <span className="text-sm text-gray-500">/ {stat.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${
                    stat.color === 'blue' ? 'from-blue-400 to-blue-600' :
                    stat.color === 'green' ? 'from-green-400 to-green-600' :
                    stat.color === 'purple' ? 'from-purple-400 to-purple-600' :
                    'from-orange-400 to-orange-600'
                  }`}
                  style={{ width: `${stat.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Drink Schedule */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Today's Drink Schedule</h3>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-500">5 drinks planned</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {todaysDrinks.map((drink, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    drink.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{drink.drink}</h4>
                    <p className="text-sm text-gray-500">{drink.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">₹{drink.cost}</p>
                  <p className="text-xs text-gray-500">{drink.calories} cal</p>
                </div>
                {drink.status === 'pending' && (
                  <button className="ml-4 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm rounded-lg hover:shadow-lg transition-all duration-200">
                    Mark Done
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Log Water</h3>
            <p className="text-sm text-gray-600">Quick add water intake</p>
          </div>
        </button>

        <button className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Add Drink</h3>
            <p className="text-sm text-gray-600">Log custom health drink</p>
          </div>
        </button>

        <button className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">View Reports</h3>
            <p className="text-sm text-gray-600">Check weekly insights</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;