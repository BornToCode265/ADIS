
import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm the Click Schools AI Assistant. I can help you with admissions, programs, facilities, and answer any questions about our school. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      // Simulate AI response - in a real implementation, this would call your AI API
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: generateAIResponse(inputMessage),
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const generateAIResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('admission') || lowerQuestion.includes('apply')) {
      return "For admissions, we offer programs for Forms 1-4. You can apply online through our admissions form or visit our campus in Lirangwe, Blantyre. Required documents include academic transcripts, birth certificate, and recommendation letters. Would you like me to help you with the application process?";
    } else if (lowerQuestion.includes('fee') || lowerQuestion.includes('cost')) {
      return "Our school fees vary by program. Day school fees are more affordable than boarding. We also offer scholarships and payment plans. Please contact our admissions office at +265 888 43 38 33 for detailed fee information. Would you like me to connect you with our financial aid counselor?";
    } else if (lowerQuestion.includes('program') || lowerQuestion.includes('subject')) {
      return "We offer comprehensive programs including Mathematics, Sciences (Biology, Chemistry, Physics), Languages (English, Chichewa), Social Sciences, Arts, Computer Studies, and Physical Education. All programs follow the MANEB curriculum. Which specific program interests you?";
    } else if (lowerQuestion.includes('location') || lowerQuestion.includes('address')) {
      return "Click Schools is located in Lirangwe, Blantyre, Malawi. Our address is P.O Box 233 BT, Blantyre. We're easily accessible by public transport. Would you like directions to our campus?";
    } else {
      return "Thank you for your question! I'm here to help with information about Click Schools. You can ask me about our academic programs, admissions process, fees, facilities, or campus life. For specific inquiries, please call us at +265 888 43 38 33 or email hello@clickschools.org.";
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <div>
                <h3 className="font-semibold">Click Schools AI Assistant</h3>
                <p className="text-xs opacity-90">Ask me anything about our school!</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
