
import React from 'react';
import { Users, GraduationCap, Award, Book } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: Users,
      value: '2000+',
      label: 'Students',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: GraduationCap,
      value: '50+',
      label: 'Teachers',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Book,
      value: '20+',
      label: 'Subjects Offered',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Award,
      value: '100+',
      label: 'Awards Won',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-yellow-300 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Our Impact in Numbers</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Over 15 years of educational excellence, we've built a legacy of success 
            and continue to shape the future leaders of Malawi.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className={`bg-gradient-to-r ${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className="text-white" size={32} />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-blue-100 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
