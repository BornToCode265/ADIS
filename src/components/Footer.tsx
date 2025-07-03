
import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="text-blue-400" size={32} />
              <div>
                <h3 className="text-xl font-bold">Click Schools</h3>
                <p className="text-sm text-gray-300">Excellence in Education</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering the next generation of leaders through innovative education, 
              character development, and global citizenship in Blantyre, Malawi.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#programs" className="text-gray-300 hover:text-white transition-colors">Our Programs</a></li>
              <li><a href="#admissions" className="text-gray-300 hover:text-white transition-colors">Admissions</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Academic Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Academic Programs</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Mathematics & Sciences</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Languages & Literature</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Computer Studies</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Arts & Music</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sports & PE</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="text-blue-400 flex-shrink-0 mt-1" size={16} />
                <div>
                  <p className="text-gray-300">Lirangwe, Blantyre</p>
                  <p className="text-gray-300">P.O Box 233 BT, Malawi</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-400 flex-shrink-0" size={16} />
                <a href="tel:+265888433833" className="text-gray-300 hover:text-white transition-colors">
                  +265 888 43 38 33
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-400 flex-shrink-0" size={16} />
                <a href="mailto:hello@clickschools.org" className="text-gray-300 hover:text-white transition-colors">
                  hello@clickschools.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 Click Schools. All rights reserved.</p>
            <p>
              Designed with ❤️ for education excellence in Malawi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
