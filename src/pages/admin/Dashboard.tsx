
import React, { useContext } from 'react';
import { UserContext } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, PieChart, TrendingUp, FileCog, Users, UserCog, Bell } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import StaffPerformanceDashboard from '@/components/admin/StaffPerformanceDashboard';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // Redirect if not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gov-blue-800 mb-2">
          {language === 'english' ? 'Admin Dashboard' : 'प्रशासन डॅशबोर्ड'}
        </h1>
        <p className="text-gray-600">
          {language === 'english'
            ? 'Monitor and manage the overall system performance'
            : 'संपूर्ण सिस्टम कामगिरी निरीक्षण आणि व्यवस्थापित करा'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Users className="h-6 w-6 text-amber-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-700">Active Staff</p>
                <h3 className="text-2xl font-bold text-amber-900">12</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-700">Resolved Complaints</p>
                <h3 className="text-2xl font-bold text-green-900">85%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileCog className="h-6 w-6 text-blue-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">Documents Processed</p>
                <h3 className="text-2xl font-bold text-blue-900">156</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-8 mb-8">
        <StaffPerformanceDashboard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card 
          className="border-blue-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          onClick={() => navigate('/admin/staff')}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-blue-100 p-4">
              <UserCog className="h-8 w-8 text-blue-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900">
                {language === 'english' ? 'Staff Management' : 'कर्मचारी व्यवस्थापन'}
              </h3>
              <p className="text-sm text-blue-600">
                {language === 'english' 
                  ? 'Add, remove, or manage staff members' 
                  : 'कर्मचारी सदस्य जोडा, काढा किंवा व्यवस्थापित करा'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-amber-100 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
          onClick={() => navigate('/admin/announcements')}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-amber-100 p-4">
              <Bell className="h-8 w-8 text-amber-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900">
                {language === 'english' ? 'Announcement Management' : 'घोषणा व्यवस्थापन'}
              </h3>
              <p className="text-sm text-amber-600">
                {language === 'english' 
                  ? 'Create, edit, or manage public announcements' 
                  : 'सार्वजनिक घोषणा तयार करा, संपादित करा किंवा व्यवस्थापित करा'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
