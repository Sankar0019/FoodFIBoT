import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Activity, Droplets, Target } from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
  drinkRecommendation?: {
    name: string;
    cost: number;
    benefits: string[];
    urgency: string;
  };
}

const EnhancedChatBot: React.FC = () => {
  const { activityData, getDrinkSuggestion, getActivityScore } = useActivity();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize with personalized greeting
      const suggestion = getDrinkSuggestion();
      const score = getActivityScore();
      
      const welcomeMessage: Message = {
        id: '1',
        text: `Hi! I'm your AI health assistant. I can see your current health score is ${score}/100. Based on your activity data, I recommend "${suggestion.drink}" - ${suggestion.reason}. How can I help you optimize your hydration today?`,
        isBot: true,
        timestamp: new Date(),
        suggestions: [
          "What should I drink now?",
          "Analyze my current health",
          "Budget-friendly options",
          "Post-workout recovery"
        ],
        drinkRecommendation: {
          name: suggestion.drink,
          cost: suggestion.cost,
          benefits: suggestion.benefits,
          urgency: suggestion.urgency
        }
      };
      
      setMessages([welcomeMessage]);
    }
  }, [isOpen, getDrinkSuggestion, getActivityScore]);

  const getPersonalizedResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    const suggestion = getDrinkSuggestion();
    const score = getActivityScore();
    const { heartRate, waterIntake, stressLevel, workoutMinutes, location } = activityData;

    if (message.includes('what should i drink') || message.includes('recommend') || message.includes('suggest')) {
      return {
        id: Date.now().toString(),
        text: `Based on your current activity data:\n\n📊 Health Score: ${score}/100\n💓 Heart Rate: ${heartRate} bpm\n💧 Water Intake: ${waterIntake}ml\n📍 Location: ${location}\n\nI recommend: ${suggestion.drink}\n\n${suggestion.reason}\n\nThis will cost ₹${suggestion.cost} and provide: ${suggestion.benefits.join(', ')}`,
        isBot: true,
        timestamp: new Date(),
        drinkRecommendation: {
          name: suggestion.drink,
          cost: suggestion.cost,
          benefits: suggestion.benefits,
          urgency: suggestion.urgency
        },
        suggestions: ["Add to my plan", "Show alternatives", "Why this drink?"]
      };
    }

    if (message.includes('analyze') || message.includes('health') || message.includes('score')) {
      let analysis = `📊 **Health Analysis Report**\n\n`;
      analysis += `Overall Score: ${score}/100\n\n`;
      
      if (heartRate > 100) {
        analysis += `🔴 Elevated heart rate (${heartRate} bpm) - You may have just exercised or be stressed\n`;
      } else if (heartRate < 60) {
        analysis += `🔵 Low heart rate (${heartRate} bpm) - Great resting rate or you might be very relaxed\n`;
      } else {
        analysis += `✅ Normal heart rate (${heartRate} bpm) - Healthy range\n`;
      }

      if (waterIntake < 1000) {
        analysis += `🚨 Low hydration (${waterIntake}ml) - URGENT: Drink water immediately!\n`;
      } else if (waterIntake < 2000) {
        analysis += `⚠️ Moderate hydration (${waterIntake}ml) - Need more water\n`;
      } else {
        analysis += `✅ Good hydration (${waterIntake}ml) - Keep it up!\n`;
      }

      if (stressLevel === 'high') {
        analysis += `😰 High stress detected - Consider calming drinks like chamomile tea\n`;
      }

      if (workoutMinutes > 0) {
        analysis += `💪 Workout detected (${workoutMinutes} min) - Focus on recovery drinks\n`;
      }

      return {
        id: Date.now().toString(),
        text: analysis,
        isBot: true,
        timestamp: new Date(),
        suggestions: ["Get drink recommendation", "Improve my score", "Track more data"]
      };
    }

    if (message.includes('workout') || message.includes('exercise') || message.includes('gym')) {
      const workoutSuggestion = heartRate > 100 ? 
        "Electrolyte Sports Drink - Your elevated heart rate shows you need immediate recovery" :
        "Protein Smoothie - Perfect for muscle recovery and growth";
      
      return {
        id: Date.now().toString(),
        text: `🏋️ **Post-Workout Recovery Plan**\n\nBased on your heart rate (${heartRate} bpm) and workout duration (${workoutMinutes} min):\n\n**Immediate (0-30 min):**\n${workoutSuggestion}\n\n**Within 2 hours:**\nChocolate milk or protein shake for muscle recovery\n\n**Throughout day:**\nIncrease water intake by 500-750ml to replace sweat loss`,
        isBot: true,
        timestamp: new Date(),
        drinkRecommendation: {
          name: workoutSuggestion.split(' - ')[0],
          cost: heartRate > 100 ? 35 : 45,
          benefits: heartRate > 100 ? 
            ['Rapid rehydration', 'Electrolyte balance', 'Energy restoration'] :
            ['Muscle recovery', 'Protein synthesis', 'Sustained energy'],
          urgency: heartRate > 100 ? 'high' : 'medium'
        },
        suggestions: ["Add to plan", "Alternative options", "Workout nutrition tips"]
      };
    }

    if (message.includes('budget') || message.includes('cheap') || message.includes('affordable')) {
      return {
        id: Date.now().toString(),
        text: `💰 **Budget-Friendly Health Drinks** (Under ₹20)\n\n🍋 **Lemon Water** - ₹5\n• Metabolism boost, Vitamin C, Detox\n• Best time: Morning\n\n🌿 **Mint Water** - ₹6\n• Digestive aid, Refreshing, Anti-inflammatory\n• Best time: After meals\n\n🫖 **Green Tea** - ₹8\n• Antioxidants, Fat burning, Mental clarity\n• Best time: Between meals\n\n🥒 **Cucumber Water** - ₹8\n• Hydration, Skin health, Low calories\n• Best time: Anytime\n\n**Pro tip:** Make large batches at home to save even more!`,
        isBot: true,
        timestamp: new Date(),
        suggestions: ["Recipe for lemon water", "Weekly budget plan", "Homemade vs store-bought"]
      };
    }

    if (message.includes('stress') || message.includes('anxious') || message.includes('calm')) {
      return {
        id: Date.now().toString(),
        text: `🧘 **Stress Management Drinks**\n\nI can see your stress level is currently "${stressLevel}". Here are calming options:\n\n🌼 **Chamomile Tea** - ₹18\n• Natural relaxant, Better sleep, Anxiety relief\n\n🍃 **Lavender Lemon Balm Tea** - ₹22\n• Stress reduction, Mood improvement, Digestive aid\n\n🥛 **Warm Milk with Turmeric** - ₹15\n• Anti-inflammatory, Sleep inducing, Comfort drink\n\n**Breathing tip:** Take 3 deep breaths before drinking for maximum relaxation effect!`,
        isBot: true,
        timestamp: new Date(),
        drinkRecommendation: {
          name: "Chamomile Tea",
          cost: 18,
          benefits: ['Stress relief', 'Better sleep', 'Natural relaxant'],
          urgency: 'medium'
        },
        suggestions: ["Meditation techniques", "Stress tracking", "Sleep improvement"]
      };
    }

    if (message.includes('energy') || message.includes('tired') || message.includes('fatigue')) {
      const energyLevel = heartRate < 70 ? 'low' : 'moderate';
      
      return {
        id: Date.now().toString(),
        text: `⚡ **Natural Energy Boosters**\n\nYour heart rate (${heartRate} bpm) suggests ${energyLevel} energy levels.\n\n🍃 **Matcha Latte** - ₹35\n• Sustained energy, L-theanine for focus, Antioxidants\n• No crash like coffee!\n\n🥤 **Green Smoothie** - ₹45\n• Vitamins B & C, Natural sugars, Fiber\n• Spinach + banana + apple\n\n🥥 **Coconut Water** - ₹25\n• Natural electrolytes, Quick energy, Hydration\n\n**Avoid:** Energy drinks, excessive caffeine, sugary sodas`,
        isBot: true,
        timestamp: new Date(),
        drinkRecommendation: {
          name: "Matcha Latte",
          cost: 35,
          benefits: ['Sustained energy', 'Mental focus', 'Antioxidants'],
          urgency: 'medium'
        },
        suggestions: ["Energy-boosting foods", "Sleep optimization", "Natural vs artificial energy"]
      };
    }

    // Default response with current activity context
    return {
      id: Date.now().toString(),
      text: `I'm here to help with personalized drink recommendations! 🤖\n\n**Current Status:**\n• Health Score: ${score}/100\n• Heart Rate: ${heartRate} bpm\n• Hydration: ${waterIntake}ml\n• Location: ${location}\n\nI can help you with:\n🏋️ Post-workout recovery\n💧 Hydration optimization\n💰 Budget-friendly options\n🧘 Stress management\n⚡ Energy boosting\n🌿 Detox & cleansing\n\nWhat would you like to focus on?`,
      isBot: true,
      timestamp: new Date(),
      suggestions: ["Analyze my health", "What should I drink now?", "Budget options", "Energy boost"]
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = getPersonalizedResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 animate-pulse"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
          AI
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-8 h-8" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-semibold">AI Health Assistant</h3>
            <div className="flex items-center space-x-2 text-xs opacity-90">
              <Activity className="w-3 h-3" />
              <span>Monitoring your activity</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Activity Status Bar */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Droplets className="w-3 h-3 text-blue-500" />
              <span>{activityData.waterIntake}ml</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3 text-green-500" />
              <span>{getActivityScore()}/100</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-red-500" />
              <span>{activityData.heartRate} bpm</span>
            </div>
          </div>
          <span className="text-green-600 font-medium">Live Monitoring</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex items-start space-x-2 max-w-[85%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.isBot ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-500'
              }`}>
                {message.isBot ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`p-3 rounded-lg ${
                message.isBot 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                
                {message.drinkRecommendation && (
                  <div className="mt-3 p-3 bg-white rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800 text-sm">
                        {message.drinkRecommendation.name}
                      </span>
                      <span className="text-green-600 font-bold text-sm">
                        ₹{message.drinkRecommendation.cost}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {message.drinkRecommendation.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-1 px-3 rounded-lg text-xs hover:shadow-lg transition-all duration-200">
                        Add to Plan
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-600 rounded-lg text-xs hover:bg-gray-50">
                        Alternatives
                      </button>
                    </div>
                  </div>
                )}

                {message.suggestions && (
                  <div className="mt-3 space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                <p className={`text-xs mt-2 ${
                  message.isBot ? 'text-gray-400' : 'text-white/70'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about drinks, health, or get personalized suggestions..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatBot;