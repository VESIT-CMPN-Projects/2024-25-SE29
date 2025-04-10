
import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DocumentType } from '@/model';
import BirthCertificateForm from './BirthCertificateForm';
import DeathCertificateForm from './DeathCertificateForm';
import MarriageCertificateForm from './MarriageCertificateForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileCheck, FileText, FileClock, User, UserRound, Heart } from 'lucide-react';
import { UserContext } from '@/App';
import { useNavigate } from 'react-router-dom';

const DocumentRequestForm = () => {
  const [documentType, setDocumentType] = useState<DocumentType>('birth');
  const { language } = useLanguage();
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  const renderForm = () => {
    switch (documentType) {
      case 'birth':
        return <BirthCertificateForm />;
      case 'death':
        return <DeathCertificateForm />;
      case 'marriage':
        return <MarriageCertificateForm />;
      default:
        return <BirthCertificateForm />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-gov-blue-800">
            {language === 'english' ? 'Request Official Documents' : 'अधिकृत दस्तऐवजांची विनंती करा'}
          </CardTitle>
          <CardDescription>
            {language === 'english' 
              ? 'Apply for official certificates and documents issued by Gram Panchayat of Kon, Kalyan West, Thane District'
              : 'कोन, कल्याण वेस्ट, ठाणे जिल्हा येथील ग्राम पंचायतीद्वारे जारी केलेली अधिकृत प्रमाणपत्रे आणि दस्तऐवजांसाठी अर्ज करा'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="birth" value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="birth" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>{language === 'english' ? 'Birth Certificate' : 'जन्म प्रमाणपत्र'}</span>
              </TabsTrigger>
              <TabsTrigger value="death" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                <span>{language === 'english' ? 'Death Certificate' : 'मृत्यू प्रमाणपत्र'}</span>
              </TabsTrigger>
              <TabsTrigger value="marriage" className="flex items-center">
                <Heart className="mr-2 h-4 w-4" />
                <span>{language === 'english' ? 'Marriage Certificate' : 'विवाह प्रमाणपत्र'}</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gov-blue-50 border-gov-blue-100">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gov-blue-100 rounded-full p-3 mb-2">
                      <FileText className="h-6 w-6 text-gov-blue-600" />
                    </div>
                    <h3 className="font-medium text-gov-blue-800">
                      {language === 'english' ? 'Submit Request' : 'विनंती सबमिट करा'}
                    </h3>
                    <p className="text-sm text-gov-blue-700 mt-1">
                      {language === 'english' 
                        ? 'Fill the form with accurate information'
                        : 'अचूक माहितीसह फॉर्म भरा'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-50 border-amber-100">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-amber-100 rounded-full p-3 mb-2">
                      <FileClock className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="font-medium text-amber-800">
                      {language === 'english' ? 'Verification' : 'सत्यापन'}
                    </h3>
                    <p className="text-sm text-amber-700 mt-1">
                      {language === 'english' 
                        ? 'Staff verifies your documents and details'
                        : 'कर्मचारी आपले दस्तऐवज आणि तपशील तपासतात'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-100">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-green-100 rounded-full p-3 mb-2">
                      <FileCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-medium text-green-800">
                      {language === 'english' ? 'Receive Document' : 'दस्तऐवज प्राप्त करा'}
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      {language === 'english' 
                        ? 'Get your certificate after approval'
                        : 'मंजुरीनंतर आपले प्रमाणपत्र मिळवा'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {!isAuthenticated ? (
              <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-600 mb-4">
                  {language === 'english' 
                    ? 'You need to log in to request official documents.' 
                    : 'अधिकृत दस्तऐवज विनंती करण्यासाठी आपल्याला लॉग इन करणे आवश्यक आहे.'}
                </p>
                <Button onClick={() => navigate('/login')} className="bg-gov-blue-600 hover:bg-gov-blue-700">
                  {language === 'english' ? 'Login Now' : 'आता लॉगिन करा'}
                </Button>
              </div>
            ) : (
              <>
                <TabsContent value="birth">
                  <BirthCertificateForm />
                </TabsContent>
                <TabsContent value="death">
                  <DeathCertificateForm />
                </TabsContent>
                <TabsContent value="marriage">
                  <MarriageCertificateForm />
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentRequestForm;
