
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, MicOff, Bot, User, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ADISChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Farm Assistant. I can help you with crop advice, irrigation schedules, pest management, and ADIS troubleshooting. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateAIResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('tomato') || lowerQuestion.includes('tomatoes')) {
      return "For tomatoes, water deeply but less frequently. During flowering stage, maintain soil moisture at 60-70%. Your ADIS should water for 15-20 minutes every 2-3 days. Watch for yellowing leaves which may indicate overwatering.";
    } else if (lowerQuestion.includes('maize') || lowerQuestion.includes('corn')) {
      return "Maize needs consistent moisture, especially during tasseling and grain filling. Set your ADIS to water for 25-30 minutes every other day. Ensure soil moisture stays above 50% but below 80%.";
    } else if (lowerQuestion.includes('pest') || lowerQuestion.includes('insect')) {
      return "Common pests in Malawi include aphids, cutworms, and whiteflies. Use neem oil spray (organic) or consult with local extension officers for approved pesticides. Proper irrigation helps plants resist pest damage.";
    } else if (lowerQuestion.includes('water') || lowerQuestion.includes('irrigation')) {
      return "Your ADIS monitors soil moisture automatically. For optimal results: Water early morning (6-8 AM), avoid midday watering, and adjust based on rainfall. Check soil moisture sensors weekly for accuracy.";
    } else if (lowerQuestion.includes('solar') || lowerQuestion.includes('battery')) {
      return "Keep solar panels clean and positioned to face south. Battery should maintain 12V+ charge. If system stops working, check: 1) Solar panel connections, 2) Battery voltage, 3) Fuse integrity. Contact support if issues persist.";
    } else if (lowerQuestion.includes('schedule') || lowerQuestion.includes('timing')) {
      return "Recommended watering schedule: Seedlings - 2x daily for 5 minutes, Vegetative growth - Daily for 15 minutes, Flowering/Fruiting - Every 2 days for 20 minutes. Adjust based on weather and soil type.";
    } else {
      return "I can help you with crop management, irrigation scheduling, pest control, and ADIS troubleshooting. Ask me about specific crops, watering schedules, or any farming challenges you're facing!";
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser.');
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <Bot size={24} />
            <span>AI Farm Assistant</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X size={20} />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.isBot && <Bot size={16} className="mt-1 flex-shrink-0" />}
                    {!message.isBot && <User size={16} className="mt-1 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      {message.isBot && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakText(message.text)}
                          className="mt-1 p-1 h-auto text-gray-600 hover:text-gray-800"
                          disabled={isSpeaking}
                        >
                          <Volume2 size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Bot size={16} />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about crops, irrigation, pests..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={startVoiceRecognition}
                variant="outline"
                size="sm"
                className={`${isListening ? 'bg-red-100 text-red-600' : ''}`}
                disabled={isListening}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={16} />
              </Button>
            </div>
            
            {/* Quick Questions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "How often should I water tomatoes?",
                "My ADIS isn't working",
                "Best crops for dry season",
                "Pest control tips"
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>  
  );
};

export default ADISChatBot;
