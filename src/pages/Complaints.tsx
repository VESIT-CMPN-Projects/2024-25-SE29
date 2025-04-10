
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContext } from 'react';
import { UserContext } from '@/App';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Complaint } from '@/model';
import ComplaintForm from '@/components/complaints/ComplaintForm';

const Complaints = () => {
  const { isAuthenticated, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new');
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyComplaints();
      if (user?.role !== 'citizen') {
        fetchAllComplaints();
      }
    }
  }, [isAuthenticated, user]);

  // Set up real-time listeners for complaints
  useEffect(() => {
    if (!isAuthenticated) return;

    // Channel for all complaints updates
    const allComplaintsChannel = supabase
      .channel('public:complaints')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'complaints'
        }, 
        (payload) => {
          console.log('Complaints change received:', payload);
          
          // Safely check if the payload has a new property and has a user_id field
          if (payload.new && 'user_id' in payload.new) {
            // Refresh the complaints lists based on the event
            if (user?.role !== 'citizen') {
              fetchAllComplaints();
            }
            
            // If it's an update to one of the user's complaints, refresh their list too
            if (payload.new.user_id === user?.id) {
              fetchMyComplaints();
            }
          } else {
            // If the payload structure is different, refresh all data to be safe
            if (user?.role !== 'citizen') {
              fetchAllComplaints();
            }
            fetchMyComplaints();
          }
        }
      )
      .subscribe();

    // Clean up the subscription when component unmounts
    return () => {
      supabase.removeChannel(allComplaintsChannel);
    };
  }, [isAuthenticated, user]);

  const fetchMyComplaints = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('Fetching complaints for user:', user.id);
      
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          id,
          title,
          description,
          status,
          created_at,
          updated_at,
          location,
          category,
          assigned_to,
          user_id,
          profile:profiles!user_id(name),
          assigned_profile:profiles!assigned_to(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching my complaints:", error);
        throw error;
      }

      console.log('Fetched my complaints:', data);

      const formattedComplaints = data.map(item => {
        // Safely access profile data with optional chaining and fallback
        const userName = item.profile?.name || 'Unknown';
        const assignedToName = item.assigned_profile?.name || 'Unassigned';
        
        return {
          id: item.id,
          userId: item.user_id,
          title: item.title,
          description: item.description,
          status: item.status,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          location: item.location,
          category: item.category,
          assignedTo: item.assigned_to,
          userName: userName,
          assignedToName: assignedToName
        } as Complaint;
      });

      setMyComplaints(formattedComplaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error(language === 'english' ? 'Failed to load your complaints' : 'आपल्या तक्रारी लोड करण्यात अयशस्वी');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllComplaints = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          id,
          title,
          description,
          status,
          created_at,
          updated_at,
          location,
          category,
          assigned_to,
          user_id,
          profile:profiles!user_id(name),
          assigned_profile:profiles!assigned_to(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching all complaints:", error);
        throw error;
      }

      console.log('Fetched all complaints:', data);

      const formattedComplaints = data.map(item => {
        // Safely access profile data with optional chaining and fallback
        const userName = item.profile?.name || 'Unknown';
        const assignedToName = item.assigned_profile?.name || 'Unassigned';
        
        return {
          id: item.id,
          userId: item.user_id,
          title: item.title,
          description: item.description,
          status: item.status,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          location: item.location,
          category: item.category,
          assignedTo: item.assigned_to,
          userName: userName,
          assignedToName: assignedToName
        } as Complaint;
      });

      setAllComplaints(formattedComplaints);
    } catch (error) {
      console.error('Error fetching all complaints:', error);
      toast.error(language === 'english' ? 'Failed to load complaints' : 'तक्रारी लोड करण्यात अयशस्वी');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComplaint = async (complaintData: Omit<Complaint, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'assignedTo' | 'comments'>) => {
    if (!isAuthenticated || !user) {
      toast.error(language === 'english' ? 'You must be logged in to submit a complaint' : 'तक्रार सादर करण्यासाठी आपण लॉग इन केलेले असणे आवश्यक आहे');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting complaint with data:", {
        user_id: user.id,
        title: complaintData.title,
        description: complaintData.description,
        category: complaintData.category,
        location: complaintData.location || null,
      });

      const { data, error } = await supabase
        .from('complaints')
        .insert({
          user_id: user.id,
          title: complaintData.title,
          description: complaintData.description,
          category: complaintData.category,
          location: complaintData.location || null,
          status: 'pending'
        })
        .select();

      if (error) {
        console.error('Error submitting complaint:', error);
        throw error;
      }

      console.log("Complaint submitted successfully:", data);
      toast.success(language === 'english' ? 'Complaint submitted successfully' : 'तक्रार यशस्वीरित्या सादर केली');
      
      fetchMyComplaints();
      setActiveTab('my');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error(language === 'english' ? 'Failed to submit complaint' : 'तक्रार सादर करण्यात अयशस्वी');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === 'english' ? 'Authentication Required' : 'प्रमाणीकरण आवश्यक'}
          </AlertTitle>
          <AlertDescription>
            {language === 'english' 
              ? 'You need to log in to submit or view complaints.' 
              : 'तक्रारी सादर करण्यासाठी कृपया लॉग इन करा'}
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'english' ? 'Login Required' : 'लॉगिन आवश्यक'}
          </h1>
          <p className="text-gray-600 mb-6">
            {language === 'english' 
              ? 'Please log in to access complaint services' 
              : 'तक्रार सेवांमध्ये प्रवेश करण्यासाठी कृपया लॉग इन करा'}
          </p>
          <Button onClick={() => navigate('/login')}>
            {language === 'english' ? 'Login Now' : 'आता लॉगिन करा'}
          </Button>
        </div>
      </div>
    );
  }

  const renderComplaintsList = (complaints: Complaint[], isUserView: boolean) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gov-blue-600" />
        </div>
      );
    }

    if (complaints.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-600 mb-4">
            {isUserView 
              ? (language === 'english' ? 'You have not submitted any complaints yet.' : 'आपण अद्याप कोणतीही तक्रार सादर केलेली नाही.') 
              : (language === 'english' ? 'No complaints have been submitted yet.' : 'अद्याप कोणतीही तक्रार सादर केलेली नाही.')}
          </p>
          {isUserView && (
            <Button onClick={() => setActiveTab('new')}>
              {language === 'english' ? 'Submit a Complaint' : 'तक्रार सादर करा'}
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {complaints.map(complaint => (
          <Card key={complaint.id} className="hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-medium">{complaint.title}</h3>
                      <p className="text-sm text-gray-500">ID: {complaint.id}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${complaint.status === 'pending' ? 'bg-amber-100 text-amber-800' : ''}
                      ${complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                      ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                      ${complaint.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                      ${complaint.status === 'verified' ? 'bg-purple-100 text-purple-800' : ''}
                    `}>
                      {complaint.status === 'in-progress' ? 'In Progress' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </div>
                  </div>
                  
                  <p className="mb-3 line-clamp-2">
                    {complaint.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Category:</span> {complaint.category}
                    </div>
                    {complaint.location && (
                      <div>
                        <span className="font-medium">Location:</span> {complaint.location}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Submitted:</span> {complaint.createdAt.toLocaleDateString()}
                    </div>
                    {!isUserView && (
                      <div>
                        <span className="font-medium">Submitted by:</span> {complaint.userName || 'Unknown'}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Assigned to:</span> {complaint.assignedToName || 'Unassigned'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 bg-gray-50 p-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/track?type=complaint&id=${complaint.id}`)}
                  >
                    {language === 'english' ? 'View Details' : 'तपशील पहा'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gov-blue-800 mb-2">
          {language === 'english' ? 'Citizen Complaint Portal' : 'नागरिक तक्रार पोर्टल'}
        </h1>
        <p className="text-gray-600">
          {language === 'english'
            ? 'Submit new complaints or track the status of your existing complaints'
            : 'नवीन तक्रारी सादर करा किंवा आपल्या विद्यमान तक्रारींची स्थिती ट्रॅक करा'}
        </p>
      </div>

      <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="new">
            {language === 'english' ? 'Submit New Complaint' : 'नवीन तक्रार सादर करा'}
          </TabsTrigger>
          <TabsTrigger value="my">
            {language === 'english' ? 'My Complaints' : 'माझ्या तक्रारी'}
          </TabsTrigger>
          {user?.role !== 'citizen' && (
            <TabsTrigger value="all">
              {language === 'english' ? 'All Complaints' : 'सर्व तक्रारी'}
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="new" className="mt-0">
          <ComplaintForm onSubmit={handleSubmitComplaint} isSubmitting={isSubmitting} />
        </TabsContent>
        
        <TabsContent value="my" className="mt-0">
          {renderComplaintsList(myComplaints, true)}
        </TabsContent>
        
        {user?.role !== 'citizen' && (
          <TabsContent value="all" className="mt-0">
            {renderComplaintsList(allComplaints, false)}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Complaints;
