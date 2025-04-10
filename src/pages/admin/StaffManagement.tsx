
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Table, TableHeader, TableBody, TableFooter, 
  TableHead, TableRow, TableCell 
} from '@/components/ui/table';
import { 
  AlertCircle, UserPlus, UserMinus, UserCheck, 
  UserCog, Search, Filter, Trash2, CheckCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter,
  DialogTrigger, DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase, ProfileJoinError } from '@/integrations/supabase/client';
import { Loading } from '@/components/ui/loading';

interface StaffProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface StaffMember {
  id: string;
  user_id: string;
  position: string;
  department: string;
  supervisor_id: string | null;
  is_active: boolean;
  joined_at: string;
  profile?: StaffProfile | null | ProfileJoinError;
}

const StaffManagement = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  const { language } = useLanguage();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPosition, setNewStaffPosition] = useState('');
  const [newStaffDepartment, setNewStaffDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Helper function to get profile data safely
  const getProfileValue = (profile: StaffProfile | null | ProfileJoinError | undefined, field: keyof StaffProfile): string => {
    if (!profile) return 'Unknown';
    if ('error' in profile) return 'Unknown';
    return profile[field] || 'Unknown';
  };

  // Fetch staff members
  const fetchStaffMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          profiles:user_id(name, email, phone, address)
        `)
        .order('joined_at', { ascending: false });

      if (error) throw error;

      // Process staff data to ensure proper type
      const processedStaff: StaffMember[] = (data || []).map(staff => ({
        id: staff.id,
        user_id: staff.user_id,
        position: staff.position,
        department: staff.department,
        supervisor_id: staff.supervisor_id,
        is_active: staff.is_active,
        joined_at: staff.joined_at,
        profile: staff.profiles
      }));

      setStaffMembers(processedStaff);
    } catch (error: any) {
      console.error('Error fetching staff members:', error);
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchStaffMembers();
    }
  }, [isAuthenticated, user]);

  // Add new staff member
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStaffEmail || !newStaffName || !newStaffPosition || !newStaffDepartment) {
      setError('Please fill in all required fields');
      return;
    }
    
    setError('');
    setSubmitting(true);
    
    try {
      // Check if user with email exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', newStaffEmail)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }
      
      if (!userData) {
        setError('User with this email does not exist. Ask them to create an account first.');
        setSubmitting(false);
        return;
      }
      
      // Check if user is already a staff member
      const { data: existingStaff } = await supabase
        .from('staff')
        .select('id')
        .eq('user_id', userData.id)
        .single();
        
      if (existingStaff) {
        setError('This user is already a staff member');
        setSubmitting(false);
        return;
      }
      
      // Update user role to staff if not already
      if (userData.role !== 'staff') {
        await supabase
          .from('profiles')
          .update({ role: 'staff' })
          .eq('id', userData.id);
      }
      
      // Add staff record
      const { error: staffError } = await supabase
        .from('staff')
        .insert({
          user_id: userData.id,
          position: newStaffPosition,
          department: newStaffDepartment,
          supervisor_id: user?.id // Current admin is supervisor
        });

      if (staffError) throw staffError;
      
      toast.success('Staff member added successfully');
      setShowDialog(false);
      setNewStaffEmail('');
      setNewStaffName('');
      setNewStaffPosition('');
      setNewStaffDepartment('');
      
      // Refresh staff list
      fetchStaffMembers();
      
    } catch (error: any) {
      console.error('Error adding staff member:', error);
      setError(error.message || 'Failed to add staff member');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle staff member active status
  const toggleStaffStatus = async (staffId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('staff')
        .update({ is_active: !currentStatus })
        .eq('id', staffId);

      if (error) throw error;
      
      toast.success(`Staff member ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      
      // Update local state
      setStaffMembers(prev => 
        prev.map(member => 
          member.id === staffId 
            ? { ...member, is_active: !currentStatus } 
            : member
        )
      );
    } catch (error: any) {
      console.error('Error updating staff status:', error);
      toast.error('Failed to update staff status');
    }
  };

  // Remove staff member
  const removeStaffMember = async (staffId: string, userId: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) {
      return;
    }
    
    try {
      // Delete staff record
      const { error: staffError } = await supabase
        .from('staff')
        .delete()
        .eq('id', staffId);

      if (staffError) throw staffError;
      
      // Update user role back to citizen
      const { error: userError } = await supabase
        .from('profiles')
        .update({ role: 'citizen' })
        .eq('id', userId);

      if (userError) throw userError;
      
      toast.success('Staff member removed successfully');
      
      // Update local state
      setStaffMembers(prev => prev.filter(member => member.id !== staffId));
    } catch (error: any) {
      console.error('Error removing staff member:', error);
      toast.error('Failed to remove staff member');
    }
  };

  // Filter staff by search term and department
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      (getProfileValue(staff.profile, 'name') || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (getProfileValue(staff.profile, 'email') || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = 
      filterDepartment === 'all' || 
      staff.department === filterDepartment;
      
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = [...new Set(staffMembers.map(staff => staff.department))];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-heading text-gov-blue-800">
                {language === 'english' ? 'Staff Management' : 'कर्मचारी व्यवस्थापन'}
              </CardTitle>
              <CardDescription>
                {language === 'english' 
                  ? 'Manage staff members and their permissions'
                  : 'कर्मचारी सदस्य आणि त्यांच्या परवानग्या व्यवस्थापित करा'}
              </CardDescription>
            </div>
            
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>{language === 'english' ? 'Add Staff Member' : 'कर्मचारी जोडा'}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {language === 'english' ? 'Add New Staff Member' : 'नवीन कर्मचारी जोडा'}
                  </DialogTitle>
                  <DialogDescription>
                    {language === 'english'
                      ? 'Add a user as a staff member to grant them access to the dashboard'
                      : 'एका वापरकर्त्याला डॅशबोर्डमध्ये प्रवेश देण्यासाठी कर्मचारी म्हणून जोडा'}
                  </DialogDescription>
                </DialogHeader>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleAddStaff}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {language === 'english' ? 'User Email' : 'वापरकर्ता ईमेल'}
                      </Label>
                      <Input 
                        id="email" 
                        placeholder={language === 'english' ? 'Enter user email' : 'वापरकर्ता ईमेल प्रविष्ट करा'} 
                        value={newStaffEmail}
                        onChange={(e) => setNewStaffEmail(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        {language === 'english'
                          ? 'The user must have an existing account'
                          : 'वापरकर्त्याकडे अस्तित्वात असलेले खाते असणे आवश्यक आहे'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {language === 'english' ? 'Full Name' : 'पूर्ण नाव'}
                      </Label>
                      <Input 
                        id="name" 
                        placeholder={language === 'english' ? 'Enter staff name' : 'कर्मचारी नाव प्रविष्ट करा'} 
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position">
                        {language === 'english' ? 'Position' : 'पद'}
                      </Label>
                      <Input 
                        id="position" 
                        placeholder={language === 'english' ? 'Enter position' : 'पद प्रविष्ट करा'} 
                        value={newStaffPosition}
                        onChange={(e) => setNewStaffPosition(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">
                        {language === 'english' ? 'Department' : 'विभाग'}
                      </Label>
                      <Select value={newStaffDepartment} onValueChange={setNewStaffDepartment} required>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'english' ? 'Select department' : 'विभाग निवडा'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Administration">Administration</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Public Works">Public Works</SelectItem>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        {language === 'english' ? 'Cancel' : 'रद्द करा'}
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loading size="sm" />
                          <span className="ml-2">
                            {language === 'english' ? 'Adding...' : 'जोडत आहे...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>{language === 'english' ? 'Add Staff' : 'कर्मचारी जोडा'}</span>
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row mb-6 gap-4">
            <div className="md:w-2/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder={language === 'english' ? 'Search staff members...' : 'कर्मचारी शोधा...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Select 
                  value={filterDepartment} 
                  onValueChange={setFilterDepartment}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder={language === 'english' ? 'Filter by department' : 'विभागानुसार फिल्टर करा'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'english' ? 'All Departments' : 'सर्व विभाग'}
                    </SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {loading ? (
            <Loading text={language === 'english' ? 'Loading staff members...' : 'कर्मचारी लोड करत आहे...'} />
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-8">
              <UserCog className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {language === 'english' ? 'No staff members found' : 'कोणतेही कर्मचारी सापडले नाहीत'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {language === 'english'
                  ? searchTerm || filterDepartment !== 'all'
                    ? 'Try changing your search or filter'
                    : 'Add staff members using the button above'
                  : searchTerm || filterDepartment !== 'all'
                    ? 'आपला शोध किंवा फिल्टर बदलून पहा'
                    : 'वरील बटण वापरून कर्मचारी जोडा'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'english' ? 'Name' : 'नाव'}</TableHead>
                    <TableHead>{language === 'english' ? 'Email' : 'ईमेल'}</TableHead>
                    <TableHead>{language === 'english' ? 'Position' : 'पद'}</TableHead>
                    <TableHead>{language === 'english' ? 'Department' : 'विभाग'}</TableHead>
                    <TableHead>{language === 'english' ? 'Status' : 'स्थिती'}</TableHead>
                    <TableHead className="text-right">{language === 'english' ? 'Actions' : 'क्रिया'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staffMember) => (
                    <TableRow key={staffMember.id}>
                      <TableCell className="font-medium">{getProfileValue(staffMember.profile, 'name')}</TableCell>
                      <TableCell>{getProfileValue(staffMember.profile, 'email')}</TableCell>
                      <TableCell>{staffMember.position}</TableCell>
                      <TableCell>{staffMember.department}</TableCell>
                      <TableCell>
                        <Badge className={staffMember.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {staffMember.is_active 
                            ? (language === 'english' ? 'Active' : 'सक्रिय')
                            : (language === 'english' ? 'Inactive' : 'निष्क्रिय')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStaffStatus(staffMember.id, staffMember.is_active)}
                            title={staffMember.is_active 
                              ? (language === 'english' ? 'Deactivate' : 'निष्क्रिय करा')
                              : (language === 'english' ? 'Activate' : 'सक्रिय करा')}
                          >
                            {staffMember.is_active ? (
                              <UserMinus className="h-4 w-4 text-red-500" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeStaffMember(staffMember.id, staffMember.user_id)}
                            title={language === 'english' ? 'Remove' : 'काढून टाका'}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffManagement;
