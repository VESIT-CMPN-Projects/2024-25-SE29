
import { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Search, FileSearch, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { ComplaintStatus, DocumentStatus } from '@/model';

// Status indicator component
const StatusIndicator = ({ status }: { status: ComplaintStatus | DocumentStatus }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return { icon: <Clock className="h-5 w-5 text-amber-500" />, color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'in-progress':
        return { icon: <Clock className="h-5 w-5 text-blue-500" />, color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'verified':
        return { icon: <CheckCircle className="h-5 w-5 text-purple-500" />, color: 'text-purple-700 bg-purple-50 border-purple-200' };
      case 'approved':
        return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, color: 'text-green-700 bg-green-50 border-green-200' };
      case 'resolved':
        return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, color: 'text-green-700 bg-green-50 border-green-200' };
      case 'rejected':
        return { icon: <XCircle className="h-5 w-5 text-red-500" />, color: 'text-red-700 bg-red-50 border-red-200' };
      default:
        return { icon: <Clock className="h-5 w-5 text-gray-500" />, color: 'text-gray-700 bg-gray-50 border-gray-200' };
    }
  };

  const { icon, color } = getStatusInfo();

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
      {icon}
      <span className="capitalize">{status.replace('-', ' ')}</span>
    </span>
  );
};

const Track = () => {
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [trackingId, setTrackingId] = useState('');
  const [trackingType, setTrackingType] = useState<'complaint' | 'document'>('complaint');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }
    
    setError('');
    setIsSearching(true);
    setNotFound(false);
    setResult(null);
    
    try {
      if (trackingType === 'complaint') {
        // Search in complaints table
        const { data, error: fetchError } = await supabase
          .from('complaints')
          .select(`
            *,
            profiles:user_id(name, email),
            assigned_profiles:assigned_to(name)
          `)
          .eq('id', trackingId)
          .single();
        
        if (fetchError || !data) {
          setNotFound(true);
        } else {
          // Get the profile data safely
          const userProfile = data.profiles ? 
            (Array.isArray(data.profiles) ? data.profiles[0] : data.profiles) : null;
          
          const assignedProfile = data.assigned_profiles ? 
            (Array.isArray(data.assigned_profiles) ? data.assigned_profiles[0] : data.assigned_profiles) : null;
          
          setResult({
            ...data,
            userName: userProfile?.name || 'Unknown',
            assignedToName: assignedProfile?.name || 'Unassigned'
          });
        }
      } else {
        // Search in document_requests table
        const { data, error: fetchError } = await supabase
          .from('document_requests')
          .select(`
            *,
            profiles:user_id(name, email),
            verifier:verified_by(name),
            approver:approved_by(name)
          `)
          .eq('id', trackingId)
          .single();
        
        if (fetchError || !data) {
          setNotFound(true);
        } else {
          // Get the profile data safely
          const userProfile = data.profiles ? 
            (Array.isArray(data.profiles) ? data.profiles[0] : data.profiles) : null;
          
          const verifierProfile = data.verifier ? 
            (Array.isArray(data.verifier) ? data.verifier[0] : data.verifier) : null;
          
          const approverProfile = data.approver ? 
            (Array.isArray(data.approver) ? data.approver[0] : data.approver) : null;
          
          setResult({
            ...data,
            userName: userProfile?.name || 'Unknown',
            verifierName: verifierProfile?.name || 'Pending',
            approverName: approverProfile?.name || 'Pending'
          });
        }
      }
    } catch (error) {
      console.error('Error tracking application:', error);
      setError('An error occurred while tracking the application');
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gov-blue-800 mb-2">
          {language === 'english' ? 'Track Your Application' : 'आपला अर्ज ट्रॅक करा'}
        </h1>
        <p className="text-gray-600">
          {language === 'english'
            ? 'Check the status of your complaints or document requests using the tracking ID'
            : 'ट्रॅकिंग आयडीचा वापर करून आपल्या तक्रारी किंवा दस्तऐवज विनंत्यांची स्थिती तपासा'}
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'english' ? 'Application Tracker' : 'अर्ज ट्रॅकर'}</CardTitle>
            <CardDescription>
              {language === 'english'
                ? 'Enter your application tracking ID to check its current status'
                : 'आपल्या अर्जाची सद्य स्थिती तपासण्यासाठी आपला अर्ज ट्रॅकिंग आयडी प्रविष्ट करा'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={trackingType} onValueChange={(value) => setTrackingType(value as 'complaint' | 'document')} className="mb-6">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="complaint">
                  {language === 'english' ? 'Complaint' : 'तक्रार'}
                </TabsTrigger>
                <TabsTrigger value="document">
                  {language === 'english' ? 'Document Request' : 'दस्तऐवज विनंती'}
                </TabsTrigger>
              </TabsList>
            </Tabs>
              
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
              
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackingId">
                  {trackingType === 'complaint' 
                    ? (language === 'english' ? 'Complaint ID' : 'तक्रार आयडी')
                    : (language === 'english' ? 'Document Request ID' : 'दस्तऐवज विनंती आयडी')}
                </Label>
                <div className="flex gap-2">
                  <Input 
                    id="trackingId" 
                    placeholder={`Enter ${trackingType} tracking ID`}
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                  />
                  <Button onClick={handleTrack} disabled={isSearching}>
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {language === 'english' ? 'Searching' : 'शोधत आहे'}
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        {language === 'english' ? 'Track' : 'ट्रॅक करा'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {!isAuthenticated && (
                <div className="text-sm text-gray-500 mt-2">
                  <p>
                    {language === 'english' 
                      ? 'Note:'
                      : 'टीप:'} <a href="/login" className="text-blue-600 hover:underline">
                      {language === 'english' ? 'Log in' : 'लॉग इन करा'}
                    </a> {language === 'english' 
                      ? 'to view all your applications at once.'
                      : 'एकाच वेळी आपले सर्व अर्ज पाहण्यासाठी.'}
                  </p>
                </div>
              )}
              
              {result && !isSearching && (
                <div className="mt-8 border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium">
                        {trackingType === 'complaint' ? result.title : `${result.document_type} Certificate Request`}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {result.id}</p>
                    </div>
                    <StatusIndicator status={trackingType === 'complaint' ? result.status : result.status} />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Submitted By</h4>
                        <p>{result.userName}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Submission Date</h4>
                        <p>{formatDate(result.created_at)}</p>
                      </div>
                    </div>
                    
                    {trackingType === 'complaint' ? (
                      <>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Category</h4>
                          <p>{result.category}</p>
                        </div>
                        {result.location && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Location</h4>
                            <p>{result.location}</p>
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Description</h4>
                          <p className="whitespace-pre-wrap">{result.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Assigned To</h4>
                          <p>{result.assignedToName}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Document Type</h4>
                          <p className="capitalize">{result.document_type}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Purpose</h4>
                          <p>{result.purpose}</p>
                        </div>
                        {result.additional_notes && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Additional Notes</h4>
                            <p>{result.additional_notes}</p>
                          </div>
                        )}
                        {result.status === 'verified' && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Verified By</h4>
                            <p>{result.verifierName}</p>
                          </div>
                        )}
                        {result.status === 'approved' && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Approved By</h4>
                            <p>{result.approverName}</p>
                          </div>
                        )}
                        {result.status === 'rejected' && result.rejection_reason && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Rejection Reason</h4>
                            <p>{result.rejection_reason}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {notFound && !isSearching && (
                <div className="mt-8 border border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileSearch className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-700 font-medium mb-2">
                    {language === 'english' ? 'No Results Found' : 'कोणतेही परिणाम सापडले नाहीत'}
                  </p>
                  <p className="text-gray-500 mb-4">
                    {language === 'english'
                      ? `We couldn't find any ${trackingType} with the ID:`
                      : `आम्हाला ID सह कोणतेही ${trackingType === 'complaint' ? 'तक्रार' : 'दस्तऐवज'} सापडले नाही:`} <strong>{trackingId}</strong>
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button variant="outline" onClick={() => {
                      setTrackingId('');
                      setNotFound(false);
                    }}>
                      {language === 'english' ? 'Try Another ID' : 'दुसरा आयडी प्रयत्न करा'}
                    </Button>
                    <Button 
                      onClick={() => navigate(trackingType === 'complaint' ? '/complaints' : '/documents')}
                    >
                      {language === 'english' 
                        ? `Submit New ${trackingType === 'complaint' ? 'Complaint' : 'Request'}`
                        : `नवीन ${trackingType === 'complaint' ? 'तक्रार' : 'विनंती'} सादर करा`}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Track;
