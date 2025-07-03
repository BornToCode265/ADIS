
import React from 'react';
import { Users, Award, BookOpen } from 'lucide-react';

const Teachers = () => {
  const teachers = [
    {
      name: 'Mrs. Chikwawa',
      subject: 'Mathematics Teacher',
      description: 'Expert in Maneb-aligned mathematics curriculum with years of experience in developing analytical thinking.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c4dd1fd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      specialties: ['Pure Mathematics', 'Applied Mathematics', 'Statistics']
    },
    {
      name: 'Mr. Mhone',
      subject: 'Science Teacher',
      description: 'Passionate about hands-on learning with state-of-the-art laboratory experiments meeting Maneb standards.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      specialties: ['Physics', 'Chemistry', 'Biology']
    },
    {
      name: 'Mrs. Tembo',
      subject: 'English Teacher',
      description: 'Specialist in English literature and language arts, ensuring students excel in communication skills.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      specialties: ['Literature', 'Creative Writing', 'Public Speaking']
    },
    {
      name: 'Mr. Banda',
      subject: 'Physical Education',
      description: 'Leading our holistic education approach through sports and fitness activities aligned with Maneb standards.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      specialties: ['Football', 'Athletics', 'Health Education']
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Users className="mr-2" size={16} />
            Meet Our Faculty
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Dedicated Teachers
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Click Schools, we pride ourselves on our experienced and passionate educators 
            who deliver quality education aligned with MANEB curriculum standards.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {teachers.map((teacher, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start space-x-6">
                {/* Teacher Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                    <img 
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {teacher.name}
                    </h3>
                    <div className="flex items-center text-blue-600 font-medium mb-3">
                      <BookOpen className="mr-2" size={16} />
                      {teacher.subject}
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {teacher.description}
                    </p>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.specialties.map((specialty, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-3">
                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <Award className="mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold mb-4">Join Our Teaching Excellence Program</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Are you a passionate educator looking to make a difference? We're always looking 
              for dedicated teachers to join our community and shape the next generation of leaders.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              View Open Positions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teachers;
