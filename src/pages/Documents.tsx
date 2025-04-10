
import React, { useState, useContext } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentRequestForm from '@/components/documents/DocumentRequestForm';
import BirthCertificateForm from '@/components/documents/BirthCertificateForm';
import DeathCertificateForm from '@/components/documents/DeathCertificateForm';
import MarriageCertificateForm from '@/components/documents/MarriageCertificateForm';
import { FileText, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/App';
import DocumentsList from '@/components/documents/DocumentsList';

const Documents = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("request");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gov-blue-800 mb-2">
          Certificate & Document Requests
        </h1>
        <p className="text-gray-600">
          Apply for various certificates and official documents issued by Gram Panchayat Kon
        </p>
      </div>
      
      <Tabs defaultValue="request" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="request">Request Documents</TabsTrigger>
          <TabsTrigger value="track">Track Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="request">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="birth" className="mb-6">
                <TabsList className="mb-6 flex flex-wrap">
                  <TabsTrigger value="birth">Birth Certificate</TabsTrigger>
                  <TabsTrigger value="death">Death Certificate</TabsTrigger>
                  <TabsTrigger value="marriage">Marriage Certificate</TabsTrigger>
                </TabsList>
                
                <TabsContent value="birth">
                  <BirthCertificateForm />
                </TabsContent>
                
                <TabsContent value="death">
                  <DeathCertificateForm />
                </TabsContent>
                
                <TabsContent value="marriage">
                  <MarriageCertificateForm />
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-gov-blue-800">Information</CardTitle>
                  <CardDescription>Important details about document requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gov-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Processing Time</h4>
                      <p className="text-sm text-gray-600">Standard processing time is 7-10 working days, depending on the certificate type and verification requirements.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-gov-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Document Requirements</h4>
                      <p className="text-sm text-gray-600">All uploaded documents must be clear, legible and in PDF, JPG or PNG format. Maximum file size is 5MB per document.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-gov-gold-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Verification Process</h4>
                      <p className="text-sm text-gray-600">You may be required to present original documents for verification before certificate issuance.</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setActiveTab("track")}
                  >
                    Track Existing Application <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-gov-blue-800">Fee Structure</CardTitle>
                  <CardDescription>Certificate issuance fees</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-700">Birth Certificate</span>
                    <span className="font-medium">₹ 50</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-700">Death Certificate</span>
                    <span className="font-medium">₹ 50</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-700">Marriage Certificate</span>
                    <span className="font-medium">₹ 100</span>
                  </div>
                  {/* <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-700">Income Certificate</span>
                    <span className="font-medium">₹ 75</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-700">Residence Certificate</span>
                    <span className="font-medium">₹ 75</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Other Certificates</span>
                    <span className="font-medium">₹ 100</span> */}
                  {/* </div> */}
                </CardContent>
                <CardFooter className="text-xs text-gray-500 pt-0">
                  * Fees are payable at the time of certificate collection.
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="track">
          {isAuthenticated && user ? (
            <DocumentsList userId={user.id} />
          ) : (
            <div className="text-center p-12 border border-dashed rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Please Login to Track Your Requests</h3>
              <p className="text-gray-500 mb-6">
                You need to be logged in to view and track your document requests.
              </p>
              <Button onClick={() => navigate('/login')}>Login Now</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documents;
