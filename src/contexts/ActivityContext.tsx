import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ActivityData {
  steps: number;
  heartRate: number;
  sleepHours: number;
  workoutMinutes: number;
  stressLevel: 'low' | 'medium' | 'high';
  location: 'home' | 'office' | 'gym' | 'outdoor';
  weather: 'hot' | 'cold' | 'moderate' | 'humid';
  lastMeal: Date | null;
  waterIntake: number;
  caffeineIntake: number;
}

interface ActivityContextType {
  activityData: ActivityData;
  updateActivity: (data: Partial<ActivityData>) => void;
  getDrinkSuggestion: () => DrinkSuggestion;
  getActivityScore: () => number;
}

interface DrinkSuggestion {
  drink: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  cost: number;
  calories: number;
  benefits: string[];
  timing: string;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [activityData, setActivityData] = useState<ActivityData>({
    steps: 0,
    heartRate: 72,
    sleepHours: 7,
    workoutMinutes: 0,
    stressLevel: 'low',
    location: 'home',
    weather: 'moderate',
    lastMeal: null,
    waterIntake: 0,
    caffeineIntake: 0
  });

  // Simulate real-time activity monitoring
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Simulate activity data updates
      const currentHour = new Date().getHours();
      const isWorkingHours = currentHour >= 9 && currentHour <= 17;
      const isEveningWorkout = currentHour >= 17 && currentHour <= 19;

      setActivityData(prev => ({
        ...prev,
        steps: prev.steps + Math.floor(Math.random() * 50),
        heartRate: isEveningWorkout ? 85 + Math.floor(Math.random() * 20) : 70 + Math.floor(Math.random() * 10),
        location: isWorkingHours ? 'office' : isEveningWorkout ? 'gym' : 'home',
        stressLevel: isWorkingHours ? 'medium' : 'low'
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const updateActivity = (data: Partial<ActivityData>) => {
    setActivityData(prev => ({ ...prev, ...data }));
  };

  const getDrinkSuggestion = (): DrinkSuggestion => {
    const currentHour = new Date().getHours();
    const { heartRate, workoutMinutes, stressLevel, location, waterIntake, caffeineIntake, lastMeal } = activityData;

    // High-intensity workout detection
    if (heartRate > 100 && workoutMinutes > 0) {
      return {
        drink: 'Electrolyte Sports Drink',
        reason: 'High heart rate detected during workout - need immediate electrolyte replenishment',
        urgency: 'high',
        cost: 35,
        calories: 80,
        benefits: ['Rapid hydration', 'Electrolyte balance', 'Energy restoration'],
        timing: 'Immediately'
      };
    }

    // Dehydration detection
    if (waterIntake < 500 && currentHour > 10) {
      return {
        drink: 'Coconut Water with Lemon',
        reason: 'Low water intake detected - risk of dehydration',
        urgency: 'high',
        cost: 30,
        calories: 50,
        benefits: ['Natural electrolytes', 'Quick hydration', 'Vitamin C boost'],
        timing: 'Now'
      };
    }

    // Stress-based suggestions
    if (stressLevel === 'high' && location === 'office') {
      return {
        drink: 'Chamomile Green Tea',
        reason: 'High stress levels detected - need calming nutrients',
        urgency: 'medium',
        cost: 20,
        calories: 5,
        benefits: ['Stress reduction', 'Mental clarity', 'Antioxidants'],
        timing: 'Within 15 minutes'
      };
    }

    // Caffeine crash prevention
    if (caffeineIntake > 200 && currentHour > 14) {
      return {
        drink: 'Matcha Latte with Almond Milk',
        reason: 'Preventing afternoon caffeine crash with sustained energy',
        urgency: 'medium',
        cost: 45,
        calories: 90,
        benefits: ['Sustained energy', 'L-theanine for focus', 'Antioxidants'],
        timing: 'Next 30 minutes'
      };
    }

    // Post-meal digestion
    if (lastMeal && Date.now() - lastMeal.getTime() < 3600000) { // Within 1 hour
      return {
        drink: 'Ginger Mint Tea',
        reason: 'Recent meal detected - supporting digestion',
        urgency: 'low',
        cost: 15,
        calories: 8,
        benefits: ['Digestive aid', 'Reduces bloating', 'Fresh breath'],
        timing: 'After 30 minutes'
      };
    }

    // Time-based suggestions
    if (currentHour >= 6 && currentHour < 9) {
      return {
        drink: 'Warm Lemon Honey Water',
        reason: 'Morning metabolism boost and detox',
        urgency: 'medium',
        cost: 8,
        calories: 25,
        benefits: ['Metabolism boost', 'Detox', 'Vitamin C'],
        timing: 'First thing in morning'
      };
    }

    if (currentHour >= 15 && currentHour < 17) {
      return {
        drink: 'Green Smoothie',
        reason: 'Afternoon energy and nutrient boost',
        urgency: 'low',
        cost: 50,
        calories: 120,
        benefits: ['Vitamins & minerals', 'Fiber', 'Natural energy'],
        timing: 'Mid-afternoon'
      };
    }

    // Default hydration
    return {
      drink: 'Infused Water (Cucumber Mint)',
      reason: 'Maintaining optimal hydration levels',
      urgency: 'low',
      cost: 10,
      calories: 5,
      benefits: ['Hydration', 'Antioxidants', 'Refreshing'],
      timing: 'Anytime'
    };
  };

  const getActivityScore = (): number => {
    const { steps, heartRate, sleepHours, waterIntake, workoutMinutes } = activityData;
    
    let score = 0;
    
    // Steps contribution (0-25 points)
    score += Math.min(steps / 400, 25);
    
    // Heart rate health (0-20 points)
    if (heartRate >= 60 && heartRate <= 100) score += 20;
    else if (heartRate >= 50 && heartRate <= 110) score += 15;
    else score += 10;
    
    // Sleep quality (0-25 points)
    if (sleepHours >= 7 && sleepHours <= 9) score += 25;
    else if (sleepHours >= 6 && sleepHours <= 10) score += 20;
    else score += 10;
    
    // Hydration (0-20 points)
    score += Math.min(waterIntake / 125, 20);
    
    // Exercise (0-10 points)
    score += Math.min(workoutMinutes / 3, 10);
    
    return Math.round(score);
  };

  return (
    <ActivityContext.Provider value={{
      activityData,
      updateActivity,
      getDrinkSuggestion,
      getActivityScore
    }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}