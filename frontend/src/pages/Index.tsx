
import React from 'react';
import ADISLanding from '../components/adis/ADISLanding';
import ADISRegister from '../components/adis/ADISRegister';
import ADISLogin from '../components/adis/ADISLogin';
import ADISDashboard from '../components/adis/ADISDashboard';
import ADISSupport from '../components/adis/ADISSupport';
import ADISAdmin from '../components/adis/ADISAdmin';
import { useState } from 'react';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);

  const renderPage = () => {
    switch(currentPage) {
      case 'register':
        return <ADISRegister onNavigate={setCurrentPage} />;
      case 'login':
        return <ADISLogin onNavigate={setCurrentPage} setUser={setUser} />;
      case 'dashboard':
        return <ADISDashboard onNavigate={setCurrentPage} user={user} />;
      case 'support':
        return <ADISSupport onNavigate={setCurrentPage} />;
      case 'admin':
        return <ADISAdmin onNavigate={setCurrentPage} />;
      default:
        return <ADISLanding onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
};

export default Index;
