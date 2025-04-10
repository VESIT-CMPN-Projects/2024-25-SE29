
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, User, Mail, Phone, Home, Save, LogOut } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from '@/components/ui/separator';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ProfileSettings = () => {
  const { user, isAuthenticated, isLoading, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!name) {
      setError('Name is required');
      return;
    }
    
    setError('');
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          phone,
          address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      
      // Update local user state
      const updatedUser = {
        ...user,
        name,
        phone,
        address
      };
      
      // We don't use setUser here because the auth state will refresh and update the context
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return <Loading fullPage text="Loading profile..." />;
  }

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-gov-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl text-gov-blue-800">
              {language === 'english' ? 'Profile Settings' : 'प्रोफाइल सेटिंग्ज'}
            </CardTitle>
            <CardDescription>
              {language === 'english' 
                ? 'View and update your profile information' 
                : 'आपली प्रोफाइल माहिती पहा आणि अपडेट करा'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gov-blue-100 rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-gov-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{language === 'english' ? 'Full Name' : 'पूर्ण नाव'}</span>
                  </div>
                </Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder={language === 'english' ? 'Enter your full name' : 'आपले पूर्ण नाव टाका'} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>{language === 'english' ? 'Email' : 'ईमेल'}</span>
                  </div>
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  {language === 'english' 
                    ? 'Email address cannot be changed' 
                    : 'ईमेल पत्ता बदलता येत नाही'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span>{language === 'english' ? 'Phone Number' : 'फोन नंबर'}</span>
                  </div>
                </Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder={language === 'english' ? 'Enter your phone number' : 'आपला फोन नंबर टाका'} 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>{language === 'english' ? 'Address' : 'पत्ता'}</span>
                  </div>
                </Label>
                <Input 
                  id="address" 
                  type="text" 
                  placeholder={language === 'english' ? 'Enter your address' : 'आपला पत्ता टाका'} 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-gov-blue-600 hover:bg-gov-blue-700"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loading size="sm" />
                      <span className="ml-2">
                        {language === 'english' ? 'Saving...' : 'सेव्ह करत आहे...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      <span>{language === 'english' ? 'Save Changes' : 'बदल सेव्ह करा'}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {language === 'english' ? 'Account Actions' : 'खाते क्रिया'}
              </h3>
              <Button
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{language === 'english' ? 'Log Out' : 'लॉग आउट'}</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              {language === 'english' 
                ? 'Account created on ' + new Date().toLocaleDateString()
                : 'खाते तयार केले ' + new Date().toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;
