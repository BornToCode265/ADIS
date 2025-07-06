
import React, { useState } from 'react';
import { 
  User, FileText, Video, MessageCircle, Cloud, 
  Droplets, Thermometer, Calendar, LogOut, Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ADISChatBot from './ADISChatBot';

const ADISDashboard = ({ onNavigate, user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showChatBot, setShowChatBot] = useState(false);

  const documents = [
    { name: 'Installation Guide', type: 'PDF', size: '2.3 MB' },
    { name: 'User Manual', type: 'PDF', size: '1.8 MB' },
    { name: 'Warranty Card', type: 'PDF', size: '0.5 MB' },
    { name: 'Maintenance Schedule', type: 'PDF', size: '0.8 MB' }
  ];

  const videos = [
    { title: 'ADIS Setup - Part 1', duration: '12:34' },
    { title: 'Solar Panel Installation', duration: '8:45' },
    { title: 'Sensor Calibration', duration: '6:22' },
    { title: 'Troubleshooting Common Issues', duration: '15:18' }
  ];

  const cropData = [
    { crop: 'Tomatoes', plantingDate: '2024-01-15', stage: 'Flowering', nextWatering: '2 hours' },
    { crop: 'Maize', plantingDate: '2024-01-20', stage: 'Vegetative', nextWatering: '4 hours' },
    { crop: 'Beans', plantingDate: '2024-02-01', stage: 'Seedling', nextWatering: '1 hour' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src="/placeholder.svg" alt="Chain Tech Hub" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-900">ADIS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User size={20} className="text-gray-600" />
                <span className="text-gray-700">{user?.name}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={() => onNavigate('landing')}
                className="flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: <Thermometer size={20} /> },
                { id: 'documents', label: 'Documents', icon: <FileText size={20} /> },
                { id: 'videos', label: 'Setup Videos', icon: <Video size={20} /> },
                { id: 'crops', label: 'Crop Manager', icon: <Droplets size={20} /> },
                { id: 'weather', label: 'Weather', icon: <Cloud size={20} /> },
                { id: 'support', label: 'Support', icon: <MessageCircle size={20} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-500">Soil Moisture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">68%</div>
                      <p className="text-sm text-gray-500">Optimal range</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-500">Water Usage Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">45L</div>
                      <p className="text-sm text-gray-500">30% less than manual</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-500">System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">Active</div>
                      <p className="text-sm text-gray-500">Running normally</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-20 flex-col">
                        <Droplets size={24} className="mb-2" />
                        <span>Manual Water</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Calendar size={24} className="mb-2" />
                        <span>Schedule</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <MessageCircle size={24} className="mb-2" />
                        <span>Support</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col"
                        onClick={() => setShowChatBot(true)}
                      >
                        <Bot size={24} className="mb-2" />
                        <span>AI Assistant</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Documents</h2>
                <div className="grid gap-4">
                  {documents.map((doc, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          <FileText size={24} className="text-red-500" />
                          <div>
                            <h3 className="font-medium">{doc.name}</h3>
                            <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Download</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Setup Videos</h2>
                <div className="grid gap-4">
                  {videos.map((video, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          <Video size={24} className="text-blue-500" />
                          <div>
                            <h3 className="font-medium">{video.title}</h3>
                            <p className="text-sm text-gray-500">Duration: {video.duration}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Watch</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'crops' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Crop Manager</h2>
                <div className="grid gap-4">
                  {cropData.map((crop, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-lg">{crop.crop}</h3>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                            {crop.stage}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Planted</p>
                            <p className="font-medium">{crop.plantingDate}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Next Watering</p>
                            <p className="font-medium text-blue-600">{crop.nextWatering}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'weather' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Weather Forecast</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <Cloud size={48} className="mx-auto mb-2 text-gray-400" />
                        <h3 className="font-medium">Today</h3>
                        <p className="text-2xl font-bold">28°C</p>
                        <p className="text-sm text-gray-500">Partly Cloudy</p>
                        <p className="text-sm text-blue-600">40% chance of rain</p>
                      </div>
                      <div className="text-center">
                        <Cloud size={48} className="mx-auto mb-2 text-gray-400" />
                        <h3 className="font-medium">Tomorrow</h3>
                        <p className="text-2xl font-bold">26°C</p>
                        <p className="text-sm text-gray-500">Cloudy</p>
                        <p className="text-sm text-blue-600">60% chance of rain</p>
                      </div>
                      <div className="text-center">
                        <Cloud size={48} className="mx-auto mb-2 text-gray-400" />
                        <h3 className="font-medium">Day After</h3>
                        <p className="text-2xl font-bold">24°C</p>
                        <p className="text-sm text-gray-500">Rainy</p>
                        <p className="text-sm text-blue-600">80% chance of rain</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Support & Help</h2>
                <div className="grid gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <MessageCircle size={48} className="mx-auto mb-4 text-green-500" />
                      <h3 className="font-medium mb-2">WhatsApp Support</h3>
                      <p className="text-gray-500 mb-4">Chat with our technical team</p>
                      <Button className="bg-green-500 hover:bg-green-600">
                        Open WhatsApp
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Bot size={48} className="mx-auto mb-4 text-blue-500" />
                      <h3 className="font-medium mb-2">AI Farm Assistant</h3>
                      <p className="text-gray-500 mb-4">Get instant help with farming questions</p>
                      <Button 
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => setShowChatBot(true)}
                      >
                        Start Chat
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI ChatBot Modal */}
      {showChatBot && (
        <ADISChatBot onClose={() => setShowChatBot(false)} />
      )}
    </div>
  );
};

export default ADISDashboard;
