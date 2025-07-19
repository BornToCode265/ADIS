
import React, { useState } from 'react';
import { ArrowLeft, Search, QrCode, FileText, Video, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ADISSupport = ({ onNavigate }) => {
  const [productId, setProductId] = useState('');
  const [searchMethod, setSearchMethod] = useState('manual'); // 'manual' or 'qr'

  const supportResources = [
    {
      title: 'Quick Start Guide',
      type: 'PDF',
      description: 'Step-by-step installation instructions',
      icon: <FileText size={24} className="text-blue-500" />
    },
    {
      title: 'Installation Video',
      type: 'Video',
      description: 'Complete setup walkthrough',
      icon: <Video size={24} className="text-green-500" />
    },
    {
      title: 'Troubleshooting Guide',
      type: 'PDF',
      description: 'Common issues and solutions',
      icon: <FileText size={24} className="text-orange-500" />
    },
    {
      title: 'Contact Support',
      type: 'Contact',
      description: 'WhatsApp: +265 888 123 456',
      icon: <MessageCircle size={24} className="text-green-600" />
    }
  ];

  const handleProductSearch = () => {
    if (productId.trim()) {
      // Simulate finding product resources
      console.log('Searching for product:', productId);
    }
  };

  const startQRScan = () => {
    // In a real implementation, this would use camera API
    alert('QR Scanner would open here. For demo, please enter product ID manually.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('landing')}
              className="mr-4"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex items-center space-x-3">
              <img src="/placeholder.svg" alt="Chain Tech Hub" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-900">ADIS Product Support</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product ID Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Access Product Resources</CardTitle>
            <p className="text-sm text-gray-600">
              Enter your product ID or scan the QR code on your ADIS box
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Method Toggle */}
            <div className="flex space-x-2">
              <Button
                variant={searchMethod === 'manual' ? 'default' : 'outline'}
                onClick={() => setSearchMethod('manual')}
                className="flex-1"
              >
                Manual Entry
              </Button>
              <Button
                variant={searchMethod === 'qr' ? 'default' : 'outline'}
                onClick={() => setSearchMethod('qr')}
                className="flex-1"
              >
                <QrCode size={16} className="mr-2" />
                QR Scan
              </Button>
            </div>

            {searchMethod === 'manual' ? (
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter Product ID (e.g., ADIS-2024-001234)"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleProductSearch} className="px-6">
                  <Search size={16} className="mr-2" />
                  Search
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <QrCode size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Position QR code within the frame</p>
                <Button onClick={startQRScan} className="bg-blue-600 hover:bg-blue-700">
                  Start QR Scanner
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Support Resources */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">General Support Resources</h2>
          <p className="text-gray-600">
            Access these resources anytime, even without a product ID
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {supportResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                      <p className="text-gray-600 mb-3">{resource.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        {resource.type === 'Contact' ? 'Contact Now' : 'Access Resource'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Offline Notice */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Offline Access</h3>
            <p className="text-blue-800">
              These resources are cached locally for offline access. You can view manuals and videos
              even without internet connection after your first visit.
            </p>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">Need personalized help?</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => onNavigate('register')} variant="outline">
              Register Product
            </Button>
            <Button onClick={() => onNavigate('login')} className="bg-green-600 hover:bg-green-700">
              Customer Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ADISSupport;
