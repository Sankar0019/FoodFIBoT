import React, { useState } from 'react';
import { Plus, Target, Clock, TrendingUp, Award, Droplets, DollarSign } from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';

const DrinkingTab: React.FC = () => {
  const { activityData, getDrinkSuggestion, updateActivity } = useActivity();
  const [selectedGoal, setSelectedGoal] = useState('hydration');
  const currentSuggestion = getDrinkSuggestion();
  
  const goals = [
    { id: 'hydration', label: 'Hydration', icon: Droplets, color: 'blue' },
    { id: 'detox', label: 'Detox', icon: Target, color: 'green' },
    { id: 'energy', label: 'Energy', icon: TrendingUp, color: 'orange' },
    { id: 'recovery', label: 'Recovery', icon: Award, color: 'purple' }
  ];

  const suggestions = {
    hydration: [
      { name: 'Lemon Water', time: 'Morning', cost: 5, calories: 10, benefits: 'Boosts metabolism' },
      { name: 'Coconut Water', time: 'Mid-day', cost: 25, calories: 45, benefits: 'Natural electrolytes' },
      { name: 'Cucumber Water', time: 'Evening', cost: 8, calories: 5, benefits: 'Anti-inflammatory' }
    ],
    detox: [
      { name: 'Green Tea', time: 'Morning', cost: 15, calories: 2, benefits: 'Antioxidants' },
      { name: 'Ginger Turmeric Tea', time: 'Afternoon', cost: 20, calories: 8, benefits: 'Anti-inflammatory' },
      { name: 'Mint Water', time: 'Evening', cost: 6, calories: 3, benefits: 'Digestive aid' }
    ],
    energy: [
      { name: 'Green Smoothie', time: 'Morning', cost: 45, calories: 120, benefits: 'Vitamins & minerals' },
      { name: 'Matcha Latte', time: 'Mid-day', cost: 35, calories: 80, benefits: 'Sustained energy' },
      { name: 'Protein Shake', time: 'Post-workout', cost: 40, calories: 150, benefits: 'Muscle recovery' }
    ],
    recovery: [
      { name: 'Chocolate Milk', time: 'Post-workout', cost: 30, calories: 180, benefits: 'Protein & carbs' },
      { name: 'Tart Cherry Juice', time: 'Evening', cost: 50, calories: 130, benefits: 'Anti-inflammatory' },
      { name: 'Electrolyte Drink', time: 'During workout', cost: 35, calories: 60, benefits: 'Hydration' }
    ]
  };

  const [todaysIntake, setTodaysIntake] = useState([
    { time: '07:30', drink: 'Lemon Water', amount: 250, logged: true },
    { time: '10:00', drink: 'Green Tea', amount: 200, logged: true },
    { time: '12:30', drink: currentSuggestion.drink, amount: 300, logged: false },
    { time: '15:00', drink: 'Water', amount: 500, logged: false }
  ]);

  const totalIntake = activityData.waterIntake;
  const dailyGoal = 2500; // ml
  const progressPercentage = (totalIntake / dailyGoal) * 100;

  const handleLogDrink = (index: number) => {
    const drink = todaysIntake[index];
    if (!drink.logged) {
      updateActivity({ 
        waterIntake: activityData.waterIntake + drink.amount 
      });
      
      setTodaysIntake(prev => 
        prev.map((item, i) => 
          i === index ? { ...item, logged: true } : item
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Hydration Progress */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Daily Hydration</h2>
            <p className="opacity-90">{totalIntake}ml of {dailyGoal}ml</p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="transform -rotate-90 w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="white"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="h-2 bg-white rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Goal Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Choose Your Goal</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  selectedGoal === goal.id
                    ? `border-${goal.color}-500 bg-${goal.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    selectedGoal === goal.id ? `text-${goal.color}-500` : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedGoal === goal.id ? `text-${goal.color}-700` : 'text-gray-600'
                  }`}>
                    {goal.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">AI Suggestions</h3>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-500 capitalize">{selectedGoal} focused</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions[selectedGoal as keyof typeof suggestions].map((suggestion, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{suggestion.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">{suggestion.time}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{suggestion.benefits}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">₹{suggestion.cost}</span>
                  </div>
                  <span className="text-gray-500">{suggestion.calories} cal</span>
                </div>
                <button className="w-full mt-3 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium">
                  Add to Plan
                </button>
              </div>
            ))}
            
            {/* AI Current Suggestion */}
            <div className="md:col-span-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-purple-800">🤖 AI Recommendation</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentSuggestion.urgency === 'high' ? 'bg-red-100 text-red-700' :
                  currentSuggestion.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {currentSuggestion.urgency} priority
                </span>
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">{currentSuggestion.drink}</h5>
              <p className="text-sm text-gray-600 mb-3">{currentSuggestion.reason}</p>
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-medium">₹{currentSuggestion.cost}</span>
                </div>
                <span className="text-gray-500">{currentSuggestion.calories} cal</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {currentSuggestion.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => updateActivity({ waterIntake: activityData.waterIntake + 250 })}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
              >
                Drink Now & Log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Intake Log */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Today's Intake</h3>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
              <Plus className="w-4 h-4" />
              <span>Log Drink</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {todaysIntake.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                item.logged ? 'bg-green-50 border-l-4 border-green-500' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.logged ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.drink}</h4>
                    <p className="text-sm text-gray-500">{item.time} • {item.amount}ml</p>
                  </div>
                </div>
                {!item.logged && (
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                    onClick={() => handleLogDrink(index)}
                    Mark Done
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkingTab;