
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from '@/components/ui/table';
import { 
  Megaphone, Plus, Pencil, Trash2, 
  AlertTriangle, Search, Check, X
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter,
  DialogTrigger, DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loading } from '@/components/ui/loading';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  important: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

const AnnouncementManagement = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  const { language } = useLanguage();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAnnouncementId, setCurrentAnnouncementId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [important, setImportant] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAnnouncements(data || []);
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'staff')) {
      fetchAnnouncements();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('admin_announcements')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'announcements' 
          }, 
          (payload) => {
            console.log('Real-time update in admin panel:', payload);
            fetchAnnouncements();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated, user]);

  // Reset form
  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('general');
    setImportant(false);
    setError('');
    setEditMode(false);
    setCurrentAnnouncementId(null);
  };

  // Open dialog for adding a new announcement
  const openAddDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  // Open dialog for editing an announcement
  const openEditDialog = (announcement: Announcement) => {
    setTitle(announcement.title);
    setContent(announcement.content);
    setCategory(announcement.category);
    setImportant(announcement.important);
    setCurrentAnnouncementId(announcement.id);
    setEditMode(true);
    setShowDialog(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category) {
      setError('Please fill in all required fields');
      return;
    }
    
    setError('');
    setSubmitting(true);
    
    try {
      if (editMode && currentAnnouncementId) {
        // Update existing announcement
        const { error } = await supabase
          .from('announcements')
          .update({
            title,
            content,
            category,
            important,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentAnnouncementId);
          
        if (error) throw error;
        
        toast.success('Announcement updated successfully');
      } else {
        // Create new announcement
        const { error } = await supabase
          .from('announcements')
          .insert({
            title,
            content,
            category,
            important,
            created_by: user?.id
          });
          
        if (error) throw error;
        
        toast.success('Announcement created successfully');
      }
      
      // Reset form and close dialog
      resetForm();
      setShowDialog(false);
      
      // Fetch updated announcements
      fetchAnnouncements();
    } catch (error: any) {
      console.error('Error saving announcement:', error);
      setError(error.message || 'Failed to save announcement');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete announcement
  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Announcement deleted successfully');
      
      // Update local state
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  // Filter announcements by search term
  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Announcement categories
  const categories = [
    { value: 'general', label: 'General' },
    { value: 'public_works', label: 'Public Works' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'event', label: 'Event' }
  ];

  // Check if user has edit permission (admin)
  const hasEditPermission = user?.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-heading text-gov-blue-800">
                {language === 'english' ? 'Announcement Management' : 'घोषणा व्यवस्थापन'}
              </CardTitle>
              <CardDescription>
                {language === 'english' 
                  ? 'Create, edit, and manage announcements for citizens'
                  : 'नागरिकांसाठी घोषणा तयार करा, संपादित करा आणि व्यवस्थापित करा'}
              </CardDescription>
            </div>
            
            {hasEditPermission && (
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>{language === 'english' ? 'New Announcement' : 'नवीन घोषणा'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editMode 
                        ? (language === 'english' ? 'Edit Announcement' : 'घोषणा संपादित करा')
                        : (language === 'english' ? 'Create New Announcement' : 'नवीन घोषणा तयार करा')}
                    </DialogTitle>
                    <DialogDescription>
                      {language === 'english'
                        ? 'Announcements will be displayed on the home page for all citizens'
                        : 'घोषणा सर्व नागरिकांसाठी मुख्यपृष्ठावर प्रदर्शित केल्या जातील'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">
                          {language === 'english' ? 'Title' : 'शीर्षक'} <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="title" 
                          placeholder={language === 'english' ? 'Enter announcement title' : 'घोषणेचे शीर्षक प्रविष्ट करा'} 
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          {language === 'english' ? 'Category' : 'श्रेणी'} <span className="text-red-500">*</span>
                        </Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger>
                            <SelectValue placeholder={language === 'english' ? 'Select category' : 'श्रेणी निवडा'} />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {categories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="content">
                          {language === 'english' ? 'Content' : 'सामग्री'} <span className="text-red-500">*</span>
                        </Label>
                        <Textarea 
                          id="content" 
                          placeholder={language === 'english' ? 'Enter announcement details' : 'घोषणेचे तपशील प्रविष्ट करा'} 
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="min-h-[120px]"
                          required
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="important" 
                          checked={important}
                          onCheckedChange={setImportant}
                        />
                        <Label htmlFor="important" className="cursor-pointer">
                          {language === 'english' ? 'Mark as important' : 'महत्त्वाचे म्हणून चिन्हांकित करा'}
                        </Label>
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
                              {language === 'english' ? 'Saving...' : 'सेव्ह करत आहे...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            <span>
                              {editMode
                                ? (language === 'english' ? 'Update' : 'अपडेट करा')
                                : (language === 'english' ? 'Create' : 'तयार करा')}
                            </span>
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder={language === 'english' ? 'Search announcements...' : 'घोषणा शोधा...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {loading ? (
            <Loading text={language === 'english' ? 'Loading announcements...' : 'घोषणा लोड करत आहे...'} />
          ) : filteredAnnouncements.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {language === 'english' ? 'No announcements found' : 'कोणत्याही घोषणा आढळल्या नाहीत'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {language === 'english'
                  ? searchTerm
                    ? 'Try changing your search'
                    : 'Create your first announcement using the button above'
                  : searchTerm
                    ? 'आपला शोध बदलून पहा'
                    : 'वरील बटण वापरून आपली पहिली घोषणा तयार करा'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'english' ? 'Title' : 'शीर्षक'}</TableHead>
                    <TableHead>{language === 'english' ? 'Category' : 'श्रेणी'}</TableHead>
                    <TableHead>{language === 'english' ? 'Date' : 'दिनांक'}</TableHead>
                    <TableHead>{language === 'english' ? 'Important' : 'महत्त्वाचे'}</TableHead>
                    <TableHead className="text-right">{language === 'english' ? 'Actions' : 'क्रिया'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnnouncements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">{announcement.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {announcement.category.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(announcement.created_at), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        {announcement.important ? (
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                            <span className="text-amber-700 text-sm">
                              {language === 'english' ? 'Yes' : 'होय'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <X className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-gray-500 text-sm">
                              {language === 'english' ? 'No' : 'नाही'}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {hasEditPermission && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(announcement)}
                                title={language === 'english' ? 'Edit' : 'संपादित करा'}
                              >
                                <Pencil className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteAnnouncement(announcement.id)}
                                title={language === 'english' ? 'Delete' : 'हटवा'}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
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

export default AnnouncementManagement;
