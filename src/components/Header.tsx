
import React, { useState } from 'react';
import { Menu, X, GraduationCap, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <a href="mailto:hello@clickschools.org" className="flex items-center space-x-1 hover:text-blue-200">
              <Mail size={14} />
              <span>hello@clickschools.org</span>
            </a>
            <div className="hidden md:flex items-center space-x-1">
              <Phone size={14} />
              <span>+265 888 43 38 33</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <a href="#" className="hover:text-blue-200">Facebook</a>
            <a href="#" className="hover:text-blue-200">Twitter</a>
            <a href="#" className="hover:text-blue-200">Instagram</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="text-blue-600" size={40} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Click Schools</h1>
              <p className="text-sm text-gray-600">Excellence in Education</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
            <a href="#programs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Programs</a>
            <a href="#admissions" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Admissions</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Apply Now
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
              <a href="#programs" className="text-gray-700 hover:text-blue-600 font-medium">Programs</a>
              <a href="#admissions" className="text-gray-700 hover:text-blue-600 font-medium">Admissions</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full w-fit">
                Apply Now
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
