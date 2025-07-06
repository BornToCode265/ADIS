import React, { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { malawiDistricts } from '@/data/malawi_districts_villages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

const ADISRegister = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    village: '',
    district: '',
    productId: '',
    latitude: '',
    longitude: ''
  });
  const [villageOptions, setVillageOptions] = useState<string[]>([]);
  const [gpsStatus, setGpsStatus] = useState('requesting');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const baseUrl = 'http://localhost/ADIS/backend/api';

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
    setPasswordError('');
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);

    try {

      // Validate phone number format
      const phoneRegex = /^\+265[0-9]{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        setPasswordError('Invalid phone number format. Use +265 followed by 9 digits.');
        setIsSubmitting(false);
        return;
      }

      // Prepare registration data
      const registrationData = {
        ...formData,
        password: formData.password, // Ensure password is sent as plain text for registration
        gps_coordinates: {
          latitude: formData.latitude,
          longitude: formData.longitude
        }
      };
      console.log('Registration data:', registrationData);
      // Validate product ID format

      // Send registration request
      const response = await axios.post(`${baseUrl}/users/register`, registrationData);
      console.log('Registration response:', response.data);

      // Navigate to login on success
      onNavigate('login');

    } catch (error) {
      console.error('Registration error:', error);
      setIsSubmitting(false);
    }




    // Simulate API call

    setTimeout(() => {
      console.log('Registration data:', formData);
      setIsSubmitting(false);
      onNavigate('login');
    }, 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'district') {
      const found = malawiDistricts.find(d => d.name === value);
      setVillageOptions(found ? found.villages : []);
      setFormData(prev => ({ ...prev, village: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-green-200 p-4 flex flex-col items-center justify-center">

      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('landing')}
            className="mr-4"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-green-600 drop-shadow">Register Your ADIS</h1>
        </div>
        <Card className="shadow-2xl border-2 border-blue-100 rounded-2xl bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-700">Product Registration</span>
              {gpsStatus === 'success' && <Check className="text-green-500" size={22} />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-3 bg-white/80 rounded-xl shadow p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-semibold">1</span> Personal Info
                  </h3>
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-9 text-sm px-2 border-blue-300 focus:ring-2 focus:ring-blue-400"
                  />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone (e.g., +265888123456)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="h-9 text-sm px-2 border-blue-300 focus:ring-2 focus:ring-blue-400"
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-9 text-sm px-2 border-blue-300 focus:ring-2 focus:ring-blue-400"
                  />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-9 text-sm px-2 border-blue-300 focus:ring-2 focus:ring-blue-400"
                  />
                  {passwordError && (
                    <p className="text-xs text-red-600 font-semibold mt-1">{passwordError}</p>
                  )}
                </div>
                {/* Location & Product */}
                <div className="space-y-3 bg-white/80 rounded-xl shadow p-6 border border-green-100">
                  <h3 className="text-lg font-bold text-green-700 mb-2 flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs font-semibold">2</span> Location & Product
                  </h3>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="h-9 text-sm px-2 border-green-300 focus:ring-2 focus:ring-green-400 rounded w-full"
                    title="District"
                  >
                    <option value="" disabled>Select District</option>
                    {malawiDistricts.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                  <select
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    required
                    className="h-9 text-sm px-2 border-green-300 focus:ring-2 focus:ring-green-400 rounded w-full"
                    disabled={!formData.district}
                    title="Village or Area"
                  >
                    <option value="" disabled>{formData.district ? 'Select Village/Area' : 'Select District First'}</option>
                    {villageOptions.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <Input
                    name="productId"
                    placeholder="Product ID / Serial Number"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                    className="h-9 text-sm px-2 border-green-300 focus:ring-2 focus:ring-green-400"
                  />
                  <p className="text-xs text-gray-500 italic">
                    Find this on your ADIS box or QR code sticker
                  </p>

                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-lg font-bold py-3 rounded-xl shadow-lg mt-4"
                disabled={isSubmitting || gpsStatus !== 'success'}
              >
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* GPS coordinates on top */}
      <div className="w-full max-w-2xl mb-4 flex flex-col items-center">
        <div className="rounded-xl bg-gradient-to-r from-blue-200 to-green-100 shadow-lg px-6 py-3 flex items-center gap-4 border border-blue-100">
          <MapPin size={28} className="text-blue-600" />
          <div>
            <span className="block text-xs text-gray-500 font-semibold">Your GPS Coordinates</span>
            {gpsStatus === 'success' ? (
              <span className="text-base font-bold text-blue-700">Lat: {parseFloat(formData.latitude).toFixed(6)}, Lng: {parseFloat(formData.longitude).toFixed(6)}</span>
            ) : gpsStatus === 'requesting' ? (
              <span className="text-sm text-gray-600 animate-pulse">Detecting location...</span>
            ) : (
              <span className="text-sm text-red-600">Location unavailable</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ADISRegister;
