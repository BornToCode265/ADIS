
import React, { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ADISRegister = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    traditionalAuthority: '',
    district: '',
    productId: '',
    latitude: '',
    longitude: ''
  });
  const [gpsStatus, setGpsStatus] = useState('requesting');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setGpsStatus('success');
        },
        (error) => {
          console.error('GPS Error:', error);
          setGpsStatus('error');
        }
      );
    } else {
      setGpsStatus('not_supported');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Registration data:', formData);
      setIsSubmitting(false);
      onNavigate('login');
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('landing')}
            className="mr-4"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Register Your ADIS</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Product Registration</span>
              {gpsStatus === 'success' && <Check className="text-green-500" size={20} />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
                
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number (e.g., +265888123456)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Location</h3>
                
                <Input
                  name="village"
                  placeholder="Village"
                  value={formData.village}
                  onChange={handleInputChange}
                  required
                />
                
                <Input
                  name="traditionalAuthority"
                  placeholder="Traditional Authority (T.A.)"
                  value={formData.traditionalAuthority}
                  onChange={handleInputChange}
                  required
                />
                
                <Input
                  name="district"
                  placeholder="District"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                />

                {/* GPS Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin size={20} className="text-blue-600" />
                    <span className="font-medium">GPS Location</span>
                  </div>
                  {gpsStatus === 'requesting' && (
                    <p className="text-gray-600">Getting your location...</p>
                  )}
                  {gpsStatus === 'success' && (
                    <div className="text-sm text-green-600">
                      <p>✓ Location captured successfully</p>
                      <p>Lat: {parseFloat(formData.latitude).toFixed(6)}</p>
                      <p>Lng: {parseFloat(formData.longitude).toFixed(6)}</p>
                    </div>
                  )}
                  {gpsStatus === 'error' && (
                    <p className="text-red-600">Unable to get location. Please enable GPS.</p>
                  )}
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Product Details</h3>
                
                <Input
                  name="productId"
                  placeholder="Product ID / Serial Number"
                  value={formData.productId}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-gray-500">
                  Find this on your ADIS box or QR code sticker
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting || gpsStatus !== 'success'}
              >
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ADISRegister;
