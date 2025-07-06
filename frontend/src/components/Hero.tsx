
import React from 'react';
import { ArrowDown, Award, Users, Book } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute top-60 right-40 w-24 h-24 bg-orange-300 rounded-full"></div>
        <div className="absolute bottom-40 left-1/3 w-20 h-20 bg-yellow-300 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <Award className="mr-2" size={16} />
              Award-winning Education Since 2010
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Welcome to
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent block">
                Click Schools
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
              Empowering the next generation of leaders through innovative education, 
              character development, and global citizenship in the heart of Blantyre, Malawi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Apply Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                Take Virtual Tour
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">2000+</div>
                <div className="text-blue-200 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-200 text-sm">Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-blue-200 text-sm">Awards</div>
              </div>
            </div>
          </div>

          {/* Right Content - Features Cards */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 rounded-lg p-3">
                  <Book className="text-white" size={24} />
                </div>
                <div className="text-white">
                  <h3 className="text-xl font-semibold mb-2">Click Girls Academy</h3>
                  <p className="text-blue-100">Empowering young women for leadership and excellence in Malawi and beyond.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-500 rounded-lg p-3">
                  <Users className="text-white" size={24} />
                </div>
                <div className="text-white">
                  <h3 className="text-xl font-semibold mb-2">Click Boys Academy</h3>
                  <p className="text-blue-100">Fostering excellence, character, and global citizenship in young men.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 rounded-lg p-3">
                  <Award className="text-white" size={24} />
                </div>
                <div className="text-white">
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
                  <p className="text-blue-100">Innovative AI tutoring and personalized learning experiences for every student.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <ArrowDown size={24} />
      </div>
    </section>
  );
};

export default Hero;
