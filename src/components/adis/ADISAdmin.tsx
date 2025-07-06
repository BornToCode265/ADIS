
import React, { useState } from 'react';
import { 
  Users, FileText, MessageSquare, MapPin, TrendingUp, 
  Settings, Plus, Edit, Trash2, Download 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const ADISAdmin = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddPromotion, setShowAddPromotion] = useState(false);

  // Mock data
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalSales: 156,
    supportTickets: 23
  };

  const recentUsers = [
    { id: 1, name: 'John Banda', location: 'Lilongwe', registered: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Mary Phiri', location: 'Blantyre', registered: '2024-01-14', status: 'Active' },
    { id: 3, name: 'Peter Mwale', location: 'Mzuzu', registered: '2024-01-13', status: 'Inactive' }
  ];

  const promotions = [
    { id: 1, title: 'Launch Discount', discount: '20%', validUntil: '2024-03-31', active: true },
    { id: 2, title: 'Rural Farmer Special', discount: '15%', validUntil: '2024-02-28', active: true }
  ];

  const testimonials = [
    { id: 1, name: 'John Banda', text: 'ADIS increased my yield by 60%', status: 'Approved' },
    { id: 2, name: 'Mary Phiri', text: 'Best investment for my farm', status: 'Pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-900">ADIS Admin Panel</h1>
            <Button onClick={() => onNavigate('landing')} variant="outline">
              Back to Website
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp size={20} /> },
                { id: 'users', label: 'Users', icon: <Users size={20} /> },
                { id: 'promotions', label: 'Promotions', icon: <Settings size={20} /> },
                { id: 'content', label: 'Content', icon: <FileText size={20} /> },
                { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={20} /> },
                { id: 'analytics', label: 'Analytics', icon: <MapPin size={20} /> }
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
          <div className="lg:col-span-4">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Users</p>
                          <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                        </div>
                        <Users className="text-blue-600" size={24} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Active Users</p>
                          <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                        </div>
                        <Users className="text-green-600" size={24} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Sales</p>
                          <p className="text-2xl font-bold text-purple-600">{stats.totalSales}</p>
                        </div>
                        <TrendingUp className="text-purple-600" size={24} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Support Tickets</p>
                          <p className="text-2xl font-bold text-orange-600">{stats.supportTickets}</p>
                        </div>
                        <MessageSquare className="text-orange-600" size={24} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.location} • {user.registered}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Download size={16} className="mr-2" />
                    Export Users
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3">Name</th>
                            <th className="text-left py-3">Location</th>
                            <th className="text-left py-3">Phone</th>
                            <th className="text-left py-3">Registered</th>
                            <th className="text-left py-3">Status</th>
                            <th className="text-left py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentUsers.map((user) => (
                            <tr key={user.id} className="border-b">
                              <td className="py-3">{user.name}</td>
                              <td className="py-3">{user.location}</td>
                              <td className="py-3">+265888123456</td>
                              <td className="py-3">{user.registered}</td>
                              <td className="py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  user.status === 'Active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.status}
                                </span>
                              </td>
                              <td className="py-3">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Edit size={14} />
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600">
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'promotions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Promotions</h2>
                  <Button 
                    onClick={() => setShowAddPromotion(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Promotion
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {promotions.map((promo) => (
                    <Card key={promo.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{promo.title}</h3>
                            <p className="text-gray-600">Discount: {promo.discount}</p>
                            <p className="text-sm text-gray-500">Valid until: {promo.validUntil}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {promo.active ? 'Active' : 'Inactive'}
                            </span>
                            <Button variant="outline" size="sm">
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add Promotion Modal */}
                {showAddPromotion && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                      <CardHeader>
                        <CardTitle>Add New Promotion</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Input placeholder="Promotion Title" />
                        <Input placeholder="Discount Percentage" />
                        <Input type="date" placeholder="Valid Until" />
                        <Textarea placeholder="Description" />
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowAddPromotion(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Save
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
                
                <div className="grid gap-4">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">{testimonial.name}</h3>
                            <p className="text-gray-600 mt-2">"{testimonial.text}"</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              testimonial.status === 'Approved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {testimonial.status}
                            </span>
                            {testimonial.status === 'Pending' && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Approve
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Geographic Coverage</h2>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                      <p className="text-gray-600">Interactive Map would be displayed here</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Districts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Lilongwe</span>
                          <span className="font-semibold">342 users</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Blantyre</span>
                          <span className="font-semibold">298 users</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mzuzu</span>
                          <span className="font-semibold">156 users</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Growth Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>This Month</span>
                          <span className="font-semibold text-green-600">+23%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Month</span>
                          <span className="font-semibold text-green-600">+18%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quarter</span>
                          <span className="font-semibold text-green-600">+67%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ADISAdmin;
