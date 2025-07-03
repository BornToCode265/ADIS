
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Stats from '../components/Stats';
import Programs from '../components/Programs';
import Teachers from '../components/Teachers';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import AIChat from '../components/AIChat';
import AdmissionsForm from '../components/AdmissionsForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      <Hero />
      <About />
      <Stats />
      <Programs />
      <AdmissionsForm />
      <Teachers />
      <Gallery />
      <Contact />
      <Footer />
      <AIChat />
    </div>
  );
};

export default Index;
