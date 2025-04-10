import { useContext, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserContext } from '@/App';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, FileText, FileWarning, Users, Clock, CheckCircle2, 
  BarChart3, Calendar, Building, Receipt, Settings, Trash2, 
  CheckCircle, Bell 
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Loading } from '@/components/ui/loading';
import { supabase, ProfileJoinError, getProfileData } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ComplaintProfile {
  name: string;
}

interface DocumentProfile {
  name: string;
}

interface Complaint {
  id: string;
  title: string;
  status: string;
  created_at: string;
  user_id: string;
  profile?: ComplaintProfile | null | ProfileJoinError;
}

interface DocumentRequest {
  id: string;
  document_type: string;
  status: string;
  created_at: string;
  purpose: string;
  user_id: string;
  profile?: DocumentProfile | null | ProfileJoinError;
}

interface DashboardStats {
  openComplaints: number;
  pendingDocuments: number;
  resolvedThisWeek: number;
  registeredCitizens: number;
}

const Dashboard = () => {
  const { isAuthenticated, user } = useContext(UserContext);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeStaffTab, setActiveStaffTab] = useState('overview');
  
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    openComplaints: 0,
    pendingDocuments: 0,
    resolvedThisWeek: 0,
    registeredCitizens: 0
  });
  
  useEffect(() => {
    if (isAuthenticated && user && (user.role === 'staff' || user.role === 'admin')) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('complaints')
        .select(`
          id,
          title,
          status,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false });
        
      if (complaintsError) throw complaintsError;
      
      const userIds = complaintsData?.map(complaint => complaint.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);
        
      if (profilesError) throw profilesError;
      
      const profileMap = (profilesData || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>);
      
      const { data: documentsData, error: documentsError } = await supabase
        .from('document_requests')
        .select(`
          id,
          document_type,
          status,
          created_at,
          purpose,
          user_id
        `)
        .order('created_at', { ascending: false });
        
      if (documentsError) throw documentsError;
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count: openComplaintsCount, error: openComplaintsError } = await supabase
        .from('complaints')
        .select('id', { count: 'exact', head: true })
        .not('status', 'eq', 'resolved');
        
      if (openComplaintsError) throw openComplaintsError;
      
      const { count: pendingDocumentsCount, error: pendingDocumentsError } = await supabase
        .from('document_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');
        
      if (pendingDocumentsError) throw pendingDocumentsError;
      
      const { count: resolvedThisWeekCount, error: resolvedThisWeekError } = await supabase
        .from('complaints')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'resolved')
        .gte('updated_at', oneWeekAgo.toISOString());
        
      if (resolvedThisWeekError) throw resolvedThisWeekError;
      
      const { count: registeredCitizensCount, error: registeredCitizensError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
        
      if (registeredCitizensError) throw registeredCitizensError;
      
      const processedComplaints = (complaintsData || []).map(complaint => {
        return {
          id: complaint.id,
          title: complaint.title,
          status: complaint.status,
          created_at: complaint.created_at,
          user_id: complaint.user_id,
          profile: profileMap[complaint.user_id] || { name: 'Unknown User' }
        };
      });
      
      const processedDocuments = (documentsData || []).map(doc => {
        return {
          id: doc.id,
          document_type: doc.document_type,
          status: doc.status,
          created_at: doc.created_at,
          purpose: doc.purpose,
          user_id: doc.user_id,
          profile: profileMap[doc.user_id] || { name: 'Unknown User' }
        };
      });
      
      setComplaints(processedComplaints);
      setDocuments(processedDocuments);
      setStats({
        openComplaints: openComplaintsCount || 0,
        pendingDocuments: pendingDocumentsCount || 0,
        resolvedThisWeek: resolvedThisWeekCount || 0,
        registeredCitizens: registeredCitizensCount || 0
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getProfileName = (profile: ComplaintProfile | DocumentProfile | null | ProfileJoinError | undefined): string => {
    if (!profile) return 'Unknown';
    if ('error' in profile) return 'Unknown';
    return profile.name || 'Unknown';
  };

  const handleDocumentAction = async (id: string, action: 'approve' | 'reject' | 'verify') => {
    if (!user) return;
    
    try {
      const updates: any = {
        status: action === 'approve' ? 'approved' : action === 'verify' ? 'verified' : 'rejected',
        updated_at: new Date().toISOString()
      };
      
      if (action === 'approve') {
        updates.approved_by = user.id;
      } else if (action === 'verify') {
        updates.verified_by = user.id;
      }
      
      const { error } = await supabase
        .from('document_requests')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Document ${action}ed successfully`);
      
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === id 
            ? { ...doc, status: updates.status } 
            : doc
        )
      );
      
    } catch (error) {
      console.error(`Error ${action}ing document:`, error);
      toast.error(`Failed to ${action} document`);
    }
  };

  const handleComplaintAction = async (id: string, action: 'inProgress' | 'resolved' | 'rejected') => {
    if (!user) return;
    
    try {
      const status = action === 'inProgress' ? 'in-progress' : action;
      
      const { error } = await supabase
        .from('complaints')
        .update({
          status,
          updated_at: new Date().toISOString(),
          ...(action === 'inProgress' && { assigned_to: user.id })
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Complaint marked as ${action === 'inProgress' ? 'in progress' : action}`);
      
      setComplaints(prev => 
        prev.map(complaint => 
          complaint.id === id 
            ? { ...complaint, status } 
            : complaint
        )
      );
      
    } catch (error) {
      console.error(`Error updating complaint:`, error);
      toast.error(`Failed to update complaint`);
    }
  };

  if (!isAuthenticated || (user?.role !== 'staff' && user?.role !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === 'english' ? 'Access Restricted' : 'प्रवेश प्रतिबंधित'}
          </AlertTitle>
          <AlertDescription>
            {language === 'english' 
              ? 'This area is restricted to Gram Panchayat staff and administrators.' 
              : 'हे क्षेत्र ग्राम पंचायत कर्मचारी आणि प्रशासकांसाठी प्रतिबंधित आहे.'}
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'english' ? 'Staff Access Only' : 'फक्त कर्मचारी प्रवेश'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isAuthenticated 
              ? (language === 'english' 
                 ? "Your account doesn't have the necessary permissions to access this area."
                 : "आपल्या खात्यास या क्षेत्रात प्रवेश करण्यासाठी आवश्यक परवानग्या नाहीत.")
              : (language === 'english'
                 ? "Please log in with staff credentials to access this area."
                 : "या क्षेत्रात प्रवेश करण्यासाठी कृपया कर्मचारी क्रेडेन्शियल्ससह लॉग इन करा.")}
          </p>
          <Button onClick={() => navigate('/login')}>
            {isAuthenticated 
              ? (language === 'english' ? "Return to Home" : "मुख्यपृष्ठावर परत जा")
              : (language === 'english' ? "Staff Login" : "कर्मचारी लॉगिन")}
          </Button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return <Loading fullPage text={language === 'english' ? 'Loading dashboard...' : 'डॅशबोर्ड लोड करत आहे...'} />;
  }

  const statsCards = [
    { 
      title: language === 'english' ? 'Open Complaints' : 'खुली तक्रारी', 
      value: stats.openComplaints.toString(), 
      icon: <FileWarning className="h-6 w-6 text-blue-600" />,
      color: 'blue'
    },
    { 
      title: language === 'english' ? 'Pending Documents' : 'प्रलंबित दस्तऐवज', 
      value: stats.pendingDocuments.toString(), 
      icon: <FileText className="h-6 w-6 text-amber-600" />,
      color: 'amber'
    },
    { 
      title: language === 'english' ? 'Resolved This Week' : 'या आठवड्यात सोडवले', 
      value: stats.resolvedThisWeek.toString(), 
      icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
      color: 'green'
    },
    { 
      title: language === 'english' ? 'Registered Citizens' : 'नोंदणीकृत नागरिक', 
      value: stats.registeredCitizens.toString(), 
      icon: <Users className="h-6 w-6 text-purple-600" />,
      color: 'purple'
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gov-blue-800 mb-2">
          {user?.role === 'admin' 
            ? (language === 'english' ? 'Admin Dashboard' : 'प्रशासक डॅशबोर्ड')
            : (language === 'english' ? 'Staff Dashboard' : 'कर्मचारी डॅशबोर्ड')}
        </h1>
        <p className="text-gray-600">
          {language === 'english'
            ? `Welcome, ${user?.name}! Manage citizen requests, verify documents, and handle tasks.`
            : `स्वागत, ${user?.name}! नागरिकांच्या विनंत्या व्यवस्थापित करा, दस्तऐवज सत्यापित करा आणि कार्ये हाताळा.`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index} className={`border-${stat.color}-100`}>
            <CardContent className="p-4 flex items-center">
              <div className={`rounded-full bg-${stat.color}-100 p-3 mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className={`text-sm text-${stat.color}-800 font-medium`}>{stat.title}</p>
                <h3 className={`text-2xl font-bold text-${stat.color}-900`}>{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue={activeStaffTab} value={activeStaffTab} onValueChange={setActiveStaffTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            {language === 'english' ? 'Overview' : 'अवलोकन'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {language === 'english' ? 'Documents' : 'दस्तऐवज'}
          </TabsTrigger>
          <TabsTrigger value="complaints">
            {language === 'english' ? 'Complaints' : 'तक्रारी'}
          </TabsTrigger>
          {user?.role === 'admin' && (
            <TabsTrigger value="admin">
              {language === 'english' ? 'Administrative' : 'प्रशासकीय'}
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'english' ? 'Documents Awaiting Action' : 'कार्यवाहीची प्रतीक्षा करणारे दस्तऐवज'}
                </CardTitle>
                <CardDescription>
                  {language === 'english'
                    ? 'Recent document requests that require verification or approval'
                    : 'सत्यापन किंवा मंजुरीची आवश्यकता असलेल��या अलीकडील दस्तऐवज विनंत्या'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.filter(doc => doc.status === 'pending').length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">
                      {language === 'english' 
                        ? 'No pending documents found'
                        : 'कोणतेही प्रलंबित दस्तऐवज आढळले नाहीत'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents
                      .filter(doc => doc.status === 'pending')
                      .slice(0, 3)
                      .map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">
                              {language === 'english'
                                ? `${doc.document_type.charAt(0).toUpperCase() + doc.document_type.slice(1)} Certificate`
                                : `${doc.document_type === 'birth' ? 'जन्म' : 
                                   doc.document_type === 'residence' ? 'निवास' : 
                                   doc.document_type === 'marriage' ? 'विवाह' :
                                   doc.document_type === 'death' ? 'मृत्यू' :
                                   'उत्पन्न'} प्रमाणपत्र`}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {getProfileName(doc.profile)} - {doc.purpose}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/documents?id=${doc.id}`)}>
                            {language === 'english' ? 'Review' : 'पुनरावलोकन'}
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => setActiveStaffTab('documents')}>
                  {language === 'english' ? 'View All Documents' : 'सर्व दस्तऐवज पहा'}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'english' ? 'Recent Complaints' : 'अलीकडील तक्रारी'}
                </CardTitle>
                <CardDescription>
                  {language === 'english'
                    ? 'Latest citizen complaints that need attention'
                    : 'लक्ष देण्याची आवश्यकता असलेल्या नवीनतम नागरिक तक्रारी'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {complaints.filter(comp => comp.status !== 'resolved').length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">
                      {language === 'english' 
                        ? 'No pending complaints found'
                        : 'कोणत्���ाही प्रलंबित तक्रारी आढळल्या नाहीत'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints
                      .filter(comp => comp.status !== 'resolved')
                      .slice(0, 3)
                      .map((complaint) => (
                        <div key={complaint.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{complaint.title}</h4>
                            <p className="text-sm text-gray-500">
                              {getProfileName(complaint.profile)} - {format(new Date(complaint.created_at), 'dd/MM/yyyy')}
                            </p>
                          </div>
                          <Badge className={
                            complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }>
                            {complaint.status === 'resolved' 
                              ? (language === 'english' ? 'Resolved' : 'निराकरण केले')
                              : complaint.status === 'in-progress'
                              ? (language === 'english' ? 'In Progress' : 'प्रगतीपथावर')
                              : (language === 'english' ? 'Pending' : 'प्रलंबित')}
                          </Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => setActiveStaffTab('complaints')}>
                  {language === 'english' ? 'View All Complaints' : 'सर्व तक्रारी पहा'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Document Requests' : 'दस्तऐवज विनंत्या'}
              </CardTitle>
              <CardDescription>
                {language === 'english'
                  ? 'Manage and process certificate requests from citizens'
                  : 'नागरिकांकडून प्रमाणपत्र विनंत्यांचे व्यवस्थापन आणि प्रक्रिया करा'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {language === 'english' ? 'No document requests found' : 'कोणत्याही दस्तऐवज विनंत्या आढळल्या नाहीत'}
                  </h3>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'english' ? 'ID' : 'आयडी'}</TableHead>
                      <TableHead>{language === 'english' ? 'Type' : 'प्रकार'}</TableHead>
                      <TableHead>{language === 'english' ? 'Citizen' : 'नागरिक'}</TableHead>
                      <TableHead>{language === 'english' ? 'Purpose' : 'हेतू'}</TableHead>
                      <TableHead>{language === 'english' ? 'Date' : 'दिनांक'}</TableHead>
                      <TableHead>{language === 'english' ? 'Status' : 'स्थिती'}</TableHead>
                      <TableHead className="text-right">{language === 'english' ? 'Actions' : 'क्रिया'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-mono text-xs">{doc.id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          {language === 'english'
                            ? `${doc.document_type.charAt(0).toUpperCase() + doc.document_type.slice(1)} Certificate`
                            : `${doc.document_type === 'birth' ? 'जन्म' : 
                               doc.document_type === 'residence' ? 'निवास' : 
                               doc.document_type === 'marriage' ? 'विवाह' :
                               doc.document_type === 'death' ? 'मृत्यू' :
                               'उत्पन्न'} प्रमाणपत्र`}
                        </TableCell>
                        <TableCell>{getProfileName(doc.profile)}</TableCell>
                        <TableCell>{doc.purpose}</TableCell>
                        <TableCell>{format(new Date(doc.created_at), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                          <Badge className={
                            doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                            doc.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                            doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }>
                            {doc.status === 'approved' 
                              ? (language === 'english' ? 'Approved' : 'मंजूर')
                              : doc.status === 'verified'
                              ? (language === 'english' ? 'Verified' : 'सत्यापित')
                              : doc.status === 'rejected'
                              ? (language === 'english' ? 'Rejected' : 'नाकारले')
                              : (language === 'english' ? 'Pending' : 'प्रलंबित')}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2 text-right">
                          {doc.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline" className="mr-2" onClick={() => handleDocumentAction(doc.id, 'verify')}>
                                {language === 'english' ? 'Verify' : 'सत्यापित करा'}
                              </Button>
                              <Button size="sm" variant="default" onClick={() => handleDocumentAction(doc.id, 'approve')}>
                                {language === 'english' ? 'Approve' : 'मंजूर करा'}
                              </Button>
                            </>
                          )}
                          {doc.status === 'verified' && (
                            <Button size="sm" variant="default" onClick={() => handleDocumentAction(doc.id, 'approve')}>
                              {language === 'english' ? 'Approve' : 'मंजूर करा'}
                            </Button>
                          )}
                          {doc.status === 'approved' && (
                            <Button size="sm" variant="outline" disabled>
                              {language === 'english' ? 'Completed' : 'पूर्ण झाले'}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="complaints" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Citizen Complaints' : 'नागरिक तक्रारी'}
              </CardTitle>
              <CardDescription>
                {language === 'english'
                  ? 'Manage and respond to submitted complaints'
                  : 'सादर केलेल्या तक्रारींचे व्यवस्थापन करा आणि प्रतिसाद द्या'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complaints.length === 0 ? (
                <div className="text-center py-8">
                  <FileWarning className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {language === 'english' ? 'No complaints found' : 'कोणत्याही तक्रारी आढळल्या नाहीत'}
                  </h3>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'english' ? 'ID' : 'आयडी'}</TableHead>
                      <TableHead>{language === 'english' ? 'Title' : 'शीर्षक'}</TableHead>
                      <TableHead>{language === 'english' ? 'Citizen' : 'नागरिक'}</TableHead>
                      <TableHead>{language === 'english' ? 'Date' : 'दिनांक'}</TableHead>
                      <TableHead>{language === 'english' ? 'Status' : 'स्थिती'}</TableHead>
                      <TableHead className="text-right">{language === 'english' ? 'Actions' : 'क्रिया'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-mono text-xs">{complaint.id.slice(0, 8)}...</TableCell>
                        <TableCell>{complaint.title}</TableCell>
                        <TableCell>{getProfileName(complaint.profile)}</TableCell>
                        <TableCell>{format(new Date(complaint.created_at), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                          <Badge className={
                            complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            complaint.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }>
                            {complaint.status === 'resolved' 
                              ? (language === 'english' ? 'Resolved' : 'निराकरण केले')
                              : complaint.status === 'in-progress'
                              ? (language === 'english' ? 'In Progress' : 'प्रगतीपथावर')
                              : complaint.status === 'rejected'
                              ? (language === 'english' ? 'Rejected' : 'नाकारले')
                              : (language === 'english' ? 'Pending' : 'प्रलंबित')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {complaint.status === 'pending' && (
                            <Button size="sm" variant="outline" onClick={() => handleComplaintAction(complaint.id, 'inProgress')}>
                              {language === 'english' ? 'Mark In Progress' : 'प्रगतीपथावर म्हणून चिन्हांकित करा'}
                            </Button>
                          )}
                          {complaint.status === 'in-progress' && (
                            <Button size="sm" variant="default" onClick={() => handleComplaintAction(complaint.id, 'resolved')}>
                              {language === 'english' ? 'Mark Resolved' : 'निराकरण केले म्हणून चिन्हांकित करा'}
                            </Button>
                          )}
                          {complaint.status === 'resolved' && (
                            <div className="flex items-center justify-end">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                              <span className="text-green-600 text-sm font-medium">
                                {language === 'english' ? 'Completed' : 'पूर्ण झाले'}
                              </span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {user?.role === 'admin' && (
          <TabsContent value="admin" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'english' ? 'Administrative Controls' : 'प्रशासकीय नियंत्रणे'}
                </CardTitle>
                <CardDescription>
                  {language === 'english'
                    ? 'Manage users, permissions, and system settings'
                    : 'वापरकर्ते, परवानग्या आणि सिस्टम सेटिंग्ज व्यवस्थापित करा'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-dashed hover:border-gov-blue-300 hover:shadow-md transition-all">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-40 cursor-pointer"
                      onClick={() => navigate('/admin/staff')}>
                      <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <Users className="h-5 w-5 text-gov-blue-600" />
                      </div>
                      <p className="font-medium">
                        {language === 'english' ? 'Staff Management' : 'कर्मचारी व्यवस्थापन'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed hover:border-gov-blue-300 hover:shadow-md transition-all">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-40 cursor-pointer"
                      onClick={() => navigate('/admin/announcements')}>
                      <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <Bell className="h-5 w-5 text-gov-blue-600" />
                      </div>
                      <p className="font-medium">
                        {language === 'english' ? 'Announcements' : 'घोषणा'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {[
                    { 
                      title: language === 'english' ? 'Analytics' : 'विश्लेषण', 
                      icon: <BarChart3 className="h-5 w-5 text-gov-blue-600" /> 
                    },
                    { 
                      title: language === 'english' ? 'Panchayat Activities' : 'पंचायत उपक्रम', 
                      icon: <Calendar className="h-5 w-5 text-gov-blue-600" /> 
                    },
                    { 
                      title: language === 'english' ? 'Village Assets' : 'गाव मालमत्ता', 
                      icon: <Building className="h-5 w-5 text-gov-blue-600" /> 
                    },
                    { 
                      title: language === 'english' ? 'Budget & Expenses' : 'बजेट आणि खर्च', 
                      icon: <Receipt className="h-5 w-5 text-gov-blue-600" /> 
                    },
                    { 
                      title: language === 'english' ? 'System Settings' : 'सिस्टम सेटिंग्ज', 
                      icon: <Settings className="h-5 w-5 text-gov-blue-600" /> 
                    },
                  ].map((item, i) => (
                    <Card key={i} className="border-dashed">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center h-40">
                        <div className="rounded-full bg-gray-100 p-3 mb-4">
                          {item.icon}
                        </div>
                        <p className="font-medium">{item.title}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
