
import React from 'react';
import { Award, Users, Book, GraduationCap } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-medium">
              <Award className="mr-2" size={16} />
              Excellence Since 2010
            </div>
            
            <h2 className="text-4xl font-bold text-gray-800 leading-tight">
              About Click Schools
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Located in the heart of Blantyre, Malawi, Click Schools is dedicated to nurturing 
              future leaders through academic excellence, innovation, and a vibrant, inclusive community. 
              Our mission is to enable students to reach their maximum educational potential and become 
              responsible global citizens.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Book className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Academic Excellence</h3>
                <p className="text-gray-600 text-sm">Comprehensive curriculum with passionate teachers helping every student reach their full potential.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-orange-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Student-Centered</h3>
                <p className="text-gray-600 text-sm">Supportive, inclusive community with small class sizes and personalized mentorship.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Future Ready</h3>
                <p className="text-gray-600 text-sm">Equipping students with skills for higher education, careers, and global citizenship.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Award className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Award-Winning</h3>
                <p className="text-gray-600 text-sm">Recognized for outstanding results and innovative programs in Malawi and beyond.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Join Our Community
              </button>
              <button className="border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300">
                Virtual Campus Tour
              </button>
            </div>
          </div>

          {/* Right Content - Image/Video */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Click Schools Campus"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-semibold">Our Beautiful Campus</h3>
                <p className="text-blue-100">Modern facilities in the heart of Blantyre</p>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -top-6 -right-6 bg-white rounded-xl p-6 shadow-lg border">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">15+</div>
                <div className="text-sm text-gray-600">Years of Excellence</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-lg border">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
