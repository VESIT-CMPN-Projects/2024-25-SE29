import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { services } from '@/data/services';
import { 
  FileText, 
  FileWarning, 
  Search, 
  Users, 
  Bell, 
  Building,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DemoNewComplaintForm, DemoComplaintsList } from '@/components/complaints/DemoComplaints';
import AnnouncementsSection from '@/components/home/AnnouncementsSection';
import StatsSection from '@/components/home/StatsSection';
import ContactSection from '@/components/home/ContactSection';
import { useContext } from 'react';
import { UserContext } from '@/App';

// Map service icons
const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'FileWarning':
      return <FileWarning className="h-6 w-6" />;
    case 'FileText':
      return <FileText className="h-6 w-6" />;
    case 'Search':
      return <Search className="h-6 w-6" />;
    case 'Users':
      return <Users className="h-6 w-6" />;
    case 'Bell':
      return <Bell className="h-6 w-6" />;
    case 'Building':
      return <Building className="h-6 w-6" />;
    default:
      return <FileText className="h-6 w-6" />;
  }
};

const Index = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useContext(UserContext);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gov-blue-800 text-white pt-16 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('/lovable-uploads/14ce2ab2-52c2-4328-b2a3-77052725532f.png')" }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
              {t('welcome')}
            </h1>
            <p className="text-lg md:text-xl text-gov-blue-100 mb-8">
              {language === 'english' 
                ? 'A digital platform connecting citizens with their local government in Kalyan West, Thane District for transparent and efficient service delivery.'
                : 'कल्याण वेस्ट, ठाणे जिल्हा येथे नागरिकांना पारदर्शक आणि कार्यक्षम सेवा देण्यासाठी स्थानिक सरकारशी जोडणारे डिजिटल व्यासपीठ.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gov-gold-500 hover:bg-gov-gold-600 text-gov-blue-900 font-medium"
                onClick={() => navigate('/complaints')}
              >
                {language === 'english' ? 'Submit a Complaint' : 'तक्रार दाखल करा'}
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-white text-white bg-gov-blue-600 hover:bg-gov-blue-700 hover:text-white"
                onClick={() => navigate('/documents')}
              >
                {language === 'english' ? 'Request Documents' : 'दस्तऐवज मागणी करा'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave SVG Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#ffffff" preserveAspectRatio="none">
            <path d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,53.3C1120,53,1280,75,1360,85.3L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section - New Addition */}
      <StatsSection />

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gov-blue-800 mb-4">
              {language === 'english' ? 'Our Services' : 'आमच्या सेवा'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'english'
                ? 'Explore the range of services offered by Gram Panchayat Kon to enhance citizen experience and improve governance in Kalyan West, Thane District.'
                : 'कल्याण वेस्ट, ठाणे जिल्हा मधील नागरिकांचा अनुभव सुधारण्यासाठी आणि प्रशासन सुधारण्यासाठी ग्राम पंचायत कोन द्वारे देऊ केलेल्या सेवांची श्रेणी एक्सप्लोर करा.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer"
                onClick={() => navigate(service.link)}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gov-blue-100 flex items-center justify-center text-gov-blue-600 mr-4">
                    {getServiceIcon(service.icon)}
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-gov-blue-700">
                    {language === 'english' ? service.title : t(service.title.toLowerCase().replace(/\s+/g, ''))}
                  </h3>
                </div>
                <p className="text-gray-600 mb-5 flex-grow">
                  {language === 'english' ? service.description : t(service.description.toLowerCase().replace(/\s+/g, ''))}
                </p>
                <div className="flex justify-end">
                  <ArrowRight className="h-5 w-5 text-gov-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Announcements Section */}
      <AnnouncementsSection />

      {/* Features Section */}
      <section className="py-16 bg-gov-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gov-blue-800 mb-4">
              {language === 'english' ? 'Why Use Our Platform?' : 'आमचे प्लॅटफॉर्म का वापरावे?'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'english'
                ? 'Our digital platform makes it easier for citizens to interact with their local government in Kalyan West, Thane District, saving time and effort.'
                : 'आमचे डिजिटल प्लॅटफॉर्म कल्याण वेस्ट, ठाणे जिल्हा मधील नागरिकांना त्यांच्या स्थानिक सरकारशी संवाद साधण्यास सोपे करते, वेळ आणि प्रयत्न वाचवते.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gov-gold-100 flex items-center justify-center text-gov-gold-600 mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-gov-blue-700 mb-3">
                {language === 'english' ? 'Easy Access' : 'सोपा प्रवेश'}
              </h3>
              <p className="text-gray-600">
                {language === 'english'
                  ? 'Access government services from anywhere, at any time without visiting the office.'
                  : 'कार्यालयात न जाता कुठूनही, कधीही सरकारी सेवांचा लाभ घ्या.'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-gov-blue-700 mb-3">
                {language === 'english' ? 'Transparency' : 'पारदर्शकता'}
              </h3>
              <p className="text-gray-600">
                {language === 'english'
                  ? 'Track your applications and complaints in real-time with complete transparency.'
                  : 'संपूर्ण पारदर्शकतेसह आपले अर्ज आणि तक्रारी रिअल-टाइम ट्रॅक करा.'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-gov-blue-700 mb-3">
                {language === 'english' ? 'Efficiency' : 'कार्यक्षमता'}
              </h3>
              <p className="text-gray-600">
                {language === 'english'
                  ? 'Faster processing times and reduced paperwork for all government services.'
                  : 'सर्व सरकारी सेवांसाठी जलद प्रक्रिया वेळ आणि कमी कागदपत्रे.'}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Actions Section - Only show for authenticated users */}
      {isAuthenticated && user?.role === 'citizen' && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-gov-blue-800 mb-6">
                  {language === 'english' ? 'Submit a Complaint' : 'तक्रार दाखल करा'}
                </h2>
                <DemoNewComplaintForm />
              </div>
              
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-gov-blue-800 mb-6">
                  {language === 'english' ? 'Recent Complaints' : 'अलीकडील तक्रारी'}
                </h2>
                <DemoComplaintsList />
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Contact Section - New Addition */}
      <ContactSection />
    </div>
  );
};

export default Index;
