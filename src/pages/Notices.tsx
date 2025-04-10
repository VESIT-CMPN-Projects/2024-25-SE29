import { useState, useContext, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Bell, Calendar, Search, FileText, Download, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import AnnouncementCard, { Announcement } from '@/components/home/AnnouncementCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserContext } from '@/App';
import { useNavigate } from 'react-router-dom';
import { AnnouncementController } from '@/controllers/AnnouncementController';
import { Loading } from '@/components/ui/loading';

// Dummy public notices data
const publicNotices = [
  {
    id: '1',
    title: 'Annual Gram Sabha Meeting Notice',
    date: new Date('2023-07-10'),
    category: 'Governance',
    downloadUrl: '#',
    description: 'Notice for the Annual Gram Sabha meeting to be held on 25th July 2023 at 10:00 AM in the village community hall.'
  },
  {
    id: '2',
    title: 'Property Tax Payment Deadline Extension',
    date: new Date('2023-06-25'),
    category: 'Taxation',
    downloadUrl: '#',
    description: 'The deadline for property tax payment has been extended to 31st August 2023. Penalties for late payment will be applicable thereafter.'
  },
  {
    id: '3',
    title: 'Village Water Supply Improvement Project',
    date: new Date('2023-06-15'),
    category: 'Infrastructure',
    downloadUrl: '#',
    description: 'Notice regarding the commencement of water supply improvement project in Kon village from 1st July 2023.'
  },
  {
    id: '4',
    title: 'School Admission Process for 2023-24',
    date: new Date('2023-06-05'),
    category: 'Education',
    downloadUrl: '#',
    description: 'Guidelines and schedule for school admissions for the academic year 2023-24 in village schools.'
  },
  {
    id: '5',
    title: 'Crop Insurance Scheme Registration',
    date: new Date('2023-05-20'),
    category: 'Agriculture',
    downloadUrl: '#',
    description: 'Registration for the Pradhan Mantri Fasal Bima Yojana (Crop Insurance Scheme) is open until 15th July 2023.'
  }
];

// Tenders data
const tenders = [
  {
    id: '1',
    title: 'Construction of Village Community Center',
    date: new Date('2023-07-01'),
    deadline: new Date('2023-07-25'),
    category: 'Construction',
    value: '₹ 25,00,000',
    downloadUrl: '#',
    description: 'Tender for the construction of a new community center in Kon village with modern facilities.'
  },
  {
    id: '2',
    title: 'Road Repair and Maintenance',
    date: new Date('2023-06-20'),
    deadline: new Date('2023-07-15'),
    category: 'Infrastructure',
    value: '₹ 15,00,000',
    downloadUrl: '#',
    description: 'Tender for repair and maintenance of internal roads in Kon village.'
  },
  {
    id: '3',
    title: 'Solar Street Light Installation',
    date: new Date('2023-06-10'),
    deadline: new Date('2023-07-05'),
    category: 'Energy',
    value: '₹ 8,00,000',
    downloadUrl: '#',
    description: 'Tender for supply and installation of 50 solar street lights across Kon village.'
  }
];

const Notices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isAdmin = user?.role === 'admin';
  
  // Fetch announcements from the database
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await AnnouncementController.getAnnouncements();
        
        if (error) throw error;
        
        setAnnouncements(data || []);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnnouncements();
    
    // Subscribe to real-time changes in announcements table
    const channel = AnnouncementController.subscribeToAnnouncements(() => {
      console.log('Real-time update received for announcements');
      fetchAnnouncements();
    });
    
    // Cleanup subscription when component unmounts
    return () => {
      AnnouncementController.unsubscribeFromChannel(channel);
    };
  }, []);
  
  // Filter notices based on search query
  const filteredNotices = publicNotices.filter(notice => 
    notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    notice.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter tenders based on search query
  const filteredTenders = tenders.filter(tender => 
    tender.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tender.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Colored block header */}
      <div className="bg-gov-blue-800 text-white p-6 rounded-lg mb-8 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">{language === 'english' ? 'Notices' : 'सूचना'}</h1>
            <p className="text-gov-gold-300">
              {language === 'english' 
                ? 'Stay updated with the latest announcements, notices, and tenders from Gram Panchayat Kon' 
                : 'ग्राम पंचायत कोन कडून नवीनतम घोषणा, सूचना आणि निविदा अद्यतनित राहा'}
            </p>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2">
              <Button 
                className="bg-gov-gold-500 hover:bg-gov-gold-600 text-gov-blue-900"
                onClick={() => navigate('/admin/announcements')}
              >
                <Edit className="mr-2 h-4 w-4" />
                {language === 'english' ? 'Manage Announcements' : 'घोषणा व्यवस्थापित करा'}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <Input 
          className="pl-10 py-6 text-base"
          placeholder={language === 'english' 
            ? "Search notices, announcements, or tenders..." 
            : "सूचना, घोषणा किंवा निविदा शोधा..."} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="announcements" className="mb-8">
        <TabsList className="mb-6 w-full md:w-auto">
          <TabsTrigger value="announcements" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" /> 
            {language === 'english' ? 'Announcements' : 'घोषणा'}
          </TabsTrigger>
          <TabsTrigger value="notices" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" /> 
            {language === 'english' ? 'Official Notices' : 'अधिकृत सूचना'}
          </TabsTrigger>
          <TabsTrigger value="tenders" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" /> 
            {language === 'english' ? 'Tenders' : 'निविदा'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="announcements" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loading size="lg" text={language === 'english' ? 'Loading announcements...' : 'घोषणा लोड करत आहे...'} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
              {isAdmin && (
                <Card 
                  className="border-dashed border-2 border-gray-300 hover:border-gov-blue-400 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                  onClick={() => navigate('/admin/announcements')}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="rounded-full bg-gov-blue-100 p-4">
                      <Plus className="h-8 w-8 text-gov-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gov-blue-800">
                        {language === 'english' ? 'Add New Announcement' : 'नवीन घोषणा जोडा'}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="notices" className="mt-4">
          <div className="space-y-4">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <Card key={notice.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge className="bg-gov-blue-100 text-gov-blue-800 hover:bg-gov-blue-200">
                        {notice.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{format(notice.date, 'PPP')}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg md:text-xl font-heading mt-2">{notice.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{notice.description}</p>
                    <Button variant="outline" size="sm" className="flex items-center" asChild>
                      <a href={notice.downloadUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        {language === 'english' ? 'Download Notice' : 'सूचना डाउनलोड करा'}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {language === 'english' ? 'No notices found' : 'कोणत्याही सूचना सापडल्या नाहीत'}
                </h3>
                <p className="text-gray-500">
                  {language === 'english' ? 'Try adjusting your search criteria' : 'आपले शोध निकष समायोजित करून पहा'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="tenders" className="mt-4">
          <div className="space-y-4">
            {filteredTenders.length > 0 ? (
              filteredTenders.map((tender) => (
                <Card key={tender.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <Badge className="bg-gov-gold-100 text-gov-gold-800 hover:bg-gov-gold-200">
                        {tender.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {language === 'english' ? 'Published: ' : 'प्रकाशित: '}
                          {format(tender.date, 'PPP')}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg md:text-xl font-heading mt-2">{tender.title}</CardTitle>
                    <CardDescription className="flex justify-between items-center mt-2">
                      <span className="font-medium text-gov-blue-600">
                        {language === 'english' ? 'Estimated Value: ' : 'अंदाजित मूल्य: '}
                        {tender.value}
                      </span>
                      <span className="text-red-600 font-medium">
                        {language === 'english' ? 'Deadline: ' : 'अंतिम तारीख: '}
                        {format(tender.deadline, 'PPP')}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{tender.description}</p>
                    <Button variant="outline" size="sm" className="flex items-center" asChild>
                      <a href={tender.downloadUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        {language === 'english' ? 'Download Tender Document' : 'निविदा दस्तऐवज डाउनलोड करा'}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {language === 'english' ? 'No tenders found' : 'कोणत्याही निविदा सापडल्या नाहीत'}
                </h3>
                <p className="text-gray-500">
                  {language === 'english' ? 'Try adjusting your search criteria' : 'आपले शोध निकष समायोजित करून पहा'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notices;
