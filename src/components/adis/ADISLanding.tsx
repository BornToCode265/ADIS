
import React, { useState } from 'react';
import { Play, CheckCircle, MapPin, Phone, DollarSign, Star, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ADISLanding = ({ onNavigate }) => {
  const [language, setLanguage] = useState('en');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "John Banda",
      location: "Lilongwe",
      image: "/placeholder.svg",
      quote: "ADIS increased my tomato yield by 60% while using 40% less water!"
    },
    {
      name: "Mary Phiri",
      location: "Blantyre", 
      image: "/placeholder.svg",
      quote: "Solar powered irrigation changed my farming completely. No more manual watering!"
    },
    {
      name: "Peter Mwale",
      location: "Mzuzu",
      image: "/placeholder.svg", 
      quote: "Best investment for my farm. Easy to install and maintain."
    }
  ];

  const features = [
    { icon: <CheckCircle className="text-green-500" size={24} />, text: "70% Water Savings" },
    { icon: <CheckCircle className="text-green-500" size={24} />, text: "Solar Powered" },
    { icon: <CheckCircle className="text-green-500" size={24} />, text: "Automated Scheduling" },
    { icon: <CheckCircle className="text-green-500" size={24} />, text: "Increased Yield" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/placeholder.svg" alt="Chain Tech Hub" className="w-10 h-10" />
            <h1 className="text-xl font-bold">Chain Tech Hub</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ny' : 'en')}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-700 rounded"
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'Chichewa' : 'English'}</span>
            </button>
            <Button onClick={() => onNavigate('login')} variant="outline" className="text-white border-white hover:bg-white hover:text-blue-900">
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                ADIS - Automated Drip Irrigation System
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Revolutionize your farming with solar-powered, automated irrigation. 
                Save water, increase yields, and farm smarter.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {feature.icon}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Price Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-blue-100">Special Launch Price</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold">MWK 220,000</span>
                      <span className="text-lg text-blue-200">/ $130</span>
                    </div>
                    <p className="text-sm text-red-200 line-through">Was MWK 280,000</p>
                  </div>
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    20% OFF
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="border-t border-white/20 pt-4">
                  <p className="text-sm text-blue-100 mb-2">Payment Options:</p>
                  <div className="flex space-x-4 text-sm">
                    <span className="bg-orange-500 px-2 py-1 rounded">Airtel Money</span>
                    <span className="bg-blue-500 px-2 py-1 rounded">TNM Mpamba</span>
                    <span className="bg-green-500 px-2 py-1 rounded">Cash</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => onNavigate('register')} 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
              >
                Get Started Now
              </Button>
            </div>

            <div className="relative">
              <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                  <Button variant="ghost" className="text-white hover:bg-white/20">
                    <Play size={48} />
                  </Button>
                </div>
              </div>
              <p className="text-center mt-4 text-blue-100">Watch ADIS in Action</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Farmers Say</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={24} />
                  ))}
                </div>
                <blockquote className="text-xl italic mb-6 text-gray-700">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                    <p className="text-gray-500 flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {testimonials[currentTestimonial].location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <Phone size={20} />
            <span>+265 888 123 456</span>
          </div>
          <p className="text-blue-200">© 2024 Chain Tech Hub. All rights reserved.</p>
          <p className="text-sm text-blue-300 mt-2">www.chaintechhub.com</p>
        </div>
      </footer>
    </div>
  );
};

export default ADISLanding;
