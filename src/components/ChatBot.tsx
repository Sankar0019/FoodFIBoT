import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI health assistant. I can suggest drinks based on your activity, remind you to stay hydrated, and help track your wellness goals. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedResponses = [
    "What should I drink after workout?",
    "I feel dehydrated, help me",
    "Suggest budget-friendly drinks",
    "What's good for digestion?"
  ];

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('workout') || message.includes('exercise')) {
      return "Great choice for post-workout hydration! I recommend:\n\n🥤 Coconut Water (₹25) - Natural electrolytes\n🥛 Chocolate Milk (₹30) - Protein + carbs for recovery\n💧 Water with electrolytes - Budget-friendly option\n\nWould you like me to add any of these to your drinking schedule?";
    }
    
    if (message.includes('dehydrated') || message.includes('thirsty')) {
      return "Let's get you hydrated quickly! 💧\n\n🚨 Immediate action: Drink 500ml water now\n🥥 Coconut water for electrolyte balance\n🍋 Lemon water for extra vitamin C\n\nI'll send you hydration reminders every 30 minutes. Stay strong! 💪";
    }
    
    if (message.includes('budget') || message.includes('cheap') || message.includes('affordable')) {
      return "Here are amazing budget-friendly options under ₹15:\n\n🍋 Lemon water - ₹5 (metabolism booster)\n🌿 Mint water - ₹6 (digestive aid)\n🫖 Green tea - ₹8 (antioxidants)\n🥒 Cucumber water - ₹8 (anti-inflammatory)\n\nAll homemade and super healthy! Which one interests you most?";
    }
    
    if (message.includes('digestion') || message.includes('stomach')) {
      return "Perfect timing for digestive health! 🌿\n\n🫖 Ginger tea - Soothes stomach (₹12)\n🌿 Mint water - Reduces bloating (₹6)\n🥛 Buttermilk - Probiotics for gut health (₹10)\n🍋 Warm lemon water - Aids digestion (₹5)\n\nDrink 30 minutes before meals for best results!";
    }
    
    if (message.includes('energy') || message.includes('tired')) {
      return "Let's boost that energy naturally! ⚡\n\n🍃 Matcha latte - Sustained energy (₹35)\n🥤 Green smoothie - Vitamins & minerals (₹45)\n☕ Green tea - Gentle caffeine (₹15)\n🥥 Coconut water - Natural sugars (₹25)\n\nAvoid energy drinks - these natural options are much better for you!";
    }
    
    if (message.includes('thanks') || message.includes('thank you')) {
      return "You're so welcome! 🌟 I'm here whenever you need healthy drink suggestions or hydration reminders. Keep up the great work with your wellness journey! 💪";
    }
    
    return "I'd love to help you with that! I can suggest drinks for:\n\n🏋️ Post-workout recovery\n💧 Better hydration\n💰 Budget-friendly options\n🌿 Digestive health\n⚡ Energy boost\n🧹 Detox support\n\nWhat specific goal would you like to focus on today?";
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

    // Simulate bot thinking time
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleSuggestedResponse = (response: string) => {
    setInputMessage(response);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">AI Health Assistant</h3>
            <p className="text-xs opacity-90">Online • Ready to help</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                <p className={`text-xs mt-1 ${
                  message.isBot ? 'text-gray-500' : 'text-white/70'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Responses */}
      {messages.length <= 1 && (
        <div className="p-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedResponse(response)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg transition-colors duration-200"
              >
                {response}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about drinks, hydration, or health..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;