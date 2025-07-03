
import React from 'react';
import { Book, Computer, Award, Users, Music, Palette } from 'lucide-react';

const Programs = () => {
  const programs = [
    {
      icon: Book,
      title: 'Academic Curriculum',
      description: 'Comprehensive curriculum including Mathematics, Sciences, Languages, and Social Sciences designed for MSCE examinations.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Computer,
      title: 'Computer Studies',
      description: 'Modern computer labs with programming, hardware, and software applications plus internet access for research.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Palette,
      title: 'Arts and Crafts',
      description: 'Creative programs including painting, sculpture, and traditional Malawian crafts to encourage self-expression.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Music,
      title: 'Music Program',
      description: 'Traditional Malawian instruments and modern music with opportunities in school choirs and bands.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'Sports & PE',
      description: 'Variety of sports including football, netball, basketball, and athletics promoting health and fitness.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Award,
      title: 'Cultural Exchange',
      description: 'International programs with schools from other countries, providing global cultural learning opportunities.',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  return (
    <section id="programs" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Book className="mr-2" size={16} />
            Our Academic Programs
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Comprehensive Education for Every Student
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer a range of academic and extracurricular programs designed to cater to 
            different interests and abilities, preparing students for success in the modern world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className={`bg-gradient-to-r ${program.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <program.icon className="text-white" size={32} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {program.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {program.description}
              </p>

              <button className="mt-6 text-blue-600 font-medium hover:text-blue-800 transition-colors duration-300 flex items-center">
                Learn More
                <svg className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
