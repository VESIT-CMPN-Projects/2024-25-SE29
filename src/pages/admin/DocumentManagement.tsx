
import React, { useContext } from 'react';
import { UserContext } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText } from 'lucide-react';
import DocumentsList from '@/components/documents/DocumentsList';
import { Navigate } from 'react-router-dom';

const DocumentManagement = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  const { language } = useLanguage();
  
  // Redirect if not staff or admin
  if (!isAuthenticated || (user?.role !== 'staff' && user?.role !== 'admin')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-heading flex items-center text-gov-blue-800">
            <FileText className="mr-2 h-6 w-6" />
            {language === 'english' ? 'Document Certificate Management' : 'दस्तावेज प्रमाणपत्र व्यवस्थापन'}
          </CardTitle>
          <CardDescription>
            {language === 'english' 
              ? 'Review and process document certificate requests from citizens'
              : 'नागरिकांकडून प्रमाणपत्र विनंती पुनरावलोकन आणि प्रक्रिया करा'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentsList isStaff={true} userId={user?.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManagement;
