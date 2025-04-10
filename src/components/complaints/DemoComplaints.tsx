import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ComplaintStatus } from '@/model';

const useSafeNavigate = () => {
  const isInRouterContext = (() => {
    try {
      useLocation();
      return true;
    } catch (e) {
      return false;
    }
  })();

  return isInRouterContext ? useNavigate() : null;
};

const complaintCategories = [
  'Water Supply',
  'Road Issues',
  'Sanitation',
  'Electricity',
  'Public Property',
  'Others'
];

const citizenComplaints = [
  { 
    id: 'C001', 
    title: 'Water Supply Issue in Sector 3', 
    category: 'Water Supply', 
    description: 'No water supply for the last 3 days in our area.',
    status: 'pending' as ComplaintStatus, 
    createdAt: new Date(2023, 9, 15)
  },
  { 
    id: 'C002', 
    title: 'Street Light Not Working', 
    category: 'Electricity',
    description: 'The street light near house no. 45 is not working for a week.',
    status: 'in-progress' as ComplaintStatus, 
    createdAt: new Date(2023, 9, 18) 
  },
];

const staffComplaints = [
  ...citizenComplaints,
  { 
    id: 'C003', 
    title: 'Drainage Overflow', 
    category: 'Sanitation',
    description: 'Drainage overflow near the market area causing health hazards.',
    status: 'resolved' as ComplaintStatus, 
    createdAt: new Date(2023, 9, 10) 
  },
  { 
    id: 'C004', 
    title: 'Garbage Not Collected', 
    category: 'Sanitation',
    description: 'Garbage not collected in West Area for 2 days.',
    status: 'pending' as ComplaintStatus, 
    createdAt: new Date(2023, 9, 20) 
  },
];

const adminComplaints = [
  ...staffComplaints,
  { 
    id: 'C005', 
    title: 'Public Park Maintenance', 
    category: 'Public Property',
    description: 'The children\'s park equipment is damaged and needs repair.',
    status: 'verified' as ComplaintStatus, 
    createdAt: new Date(2023, 9, 5) 
  },
  { 
    id: 'C006', 
    title: 'Community Hall Booking Issue', 
    category: 'Others',
    description: 'Double booking for the community hall on 15th October.',
    status: 'in-progress' as ComplaintStatus, 
    createdAt: new Date(2023, 9, 12) 
  },
];

export const DemoNewComplaintForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const { t, language } = useLanguage();
  const navigate = useSafeNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !description) {
      toast.error(language === 'english' 
        ? 'Please fill all required fields' 
        : 'कृपया सर्व आवश्यक क्षेत्रे भरा');
      return;
    }
    
    toast.success(language === 'english' 
      ? 'Complaint submitted successfully! Tracking ID: C007' 
      : 'तक्रार यशस्वीरित्या सादर केली! ट्रॅकिंग आयडी: C007');
    
    setTitle('');
    setCategory('');
    setLocation('');
    setDescription('');
    
    if (navigate) {
      setTimeout(() => {
        navigate('/track');
      }, 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('complaintTitle')}</CardTitle>
        <CardDescription>{t('complaintDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              {language === 'english' ? 'Complaint Title' : 'तक्रार शीर्षक'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder={language === 'english' ? 'Enter a brief title' : 'संक्षिप्त शीर्षक प्रविष्ट करा'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">
              {t('complaintCategory')} <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'english' ? 'Select a category' : 'श्रेणी निवडा'} />
              </SelectTrigger>
              <SelectContent>
                {complaintCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {language === 'english' ? cat : t(cat.toLowerCase().replace(' ', ''))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">{t('complaintLocation')}</Label>
            <Input
              id="location"
              placeholder={language === 'english' ? 'Enter location details' : 'स्थान तपशील प्रविष्ट करा'}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">
              {t('complaintDescription')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder={language === 'english' ? 'Describe your complaint in detail' : 'आपल्या तक्रारीचे तपशीलवार वर्णन करा'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[120px]"
            />
          </div>
          
          <Button type="submit" className="w-full">{t('submit')}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export const DemoComplaintsList = ({ userRole = 'citizen' }: { userRole?: 'citizen' | 'staff' | 'admin' }) => {
  const { language } = useLanguage();
  const complaints = userRole === 'citizen' 
    ? citizenComplaints 
    : userRole === 'staff' 
      ? staffComplaints 
      : adminComplaints;

  const getStatusText = (status: ComplaintStatus) => {
    switch(status) {
      case 'pending': return language === 'english' ? 'Pending' : 'प्रलंबित';
      case 'in-progress': return language === 'english' ? 'In Progress' : 'प्रगतीपथावर';
      case 'resolved': return language === 'english' ? 'Resolved' : 'निराकरण केले';
      case 'rejected': return language === 'english' ? 'Rejected' : 'नाकारले';
      case 'verified': return language === 'english' ? 'Verified' : 'सत्यापित';
      default: return status;
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'verified': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'english' ? 'My Complaints' : 'माझ्या तक्रारी'}
        </CardTitle>
        <CardDescription>
          {language === 'english' 
            ? 'Track the status of your submitted complaints' 
            : 'आपल्या सादर केलेल्या तक्रारींची स्थिती ट्रॅक करा'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <div key={complaint.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{complaint.title}</h4>
                    <p className="text-sm text-gray-500">
                      {language === 'english' 
                        ? `Complaint ID: ${complaint.id}` 
                        : `तक्रार आयडी: ${complaint.id}`}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {getStatusText(complaint.status)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 my-2 line-clamp-2">{complaint.description}</p>
                <div className="flex justify-between mt-4">
                  <span className="text-sm text-gray-500">
                    {language === 'english' 
                      ? `Submitted: ${complaint.createdAt.toLocaleDateString()}` 
                      : `सादर: ${complaint.createdAt.toLocaleDateString()}`}
                  </span>
                  <Button size="sm" variant="outline">
                    {language === 'english' ? 'View Details' : 'तपशील पहा'}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-gray-500">
                {language === 'english' 
                  ? 'No complaints submitted yet.' 
                  : 'अद्याप कोणत्याही तक्रारी सादर केलेल्या नाहीत.'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
