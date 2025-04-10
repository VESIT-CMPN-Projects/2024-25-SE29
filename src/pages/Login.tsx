import { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, User, UserCog, ShieldCheck, Mail, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserRole } from '@/model';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { loginWithDemo } from '@/integrations/supabase/client';
import { Loading } from '@/components/ui/loading';

const Login = () => {
  const { isAuthenticated, isLoading, login, signup } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  
  const [error, setError] = useState('');
  const { language } = useLanguage();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setLoginLoading(true);
    
    try {
      const user = await login(loginEmail, loginPassword);
      setLoginLoading(false);
      
      if (user) {
        if (user.role === 'citizen') {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      setLoginLoading(false);
      setError(error.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setError('');
    setSignupLoading(true);
    
    try {
      const user = await signup(email, password, {
        name,
        role: userRole,
        phone,
        address
      });
      
      setSignupLoading(false);
      
      if (user) {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setAddress('');
        
        setActiveTab('login');
      }
    } catch (error: any) {
      setSignupLoading(false);
      setError(error.message || 'Signup failed. Please try again.');
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError('');
    setLoginLoading(true);
    
    try {
      const { data, error } = await loginWithDemo(role);
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        toast.success(`Welcome, Demo ${role.charAt(0).toUpperCase() + role.slice(1)}!`);
        
        if (role === 'citizen') {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Demo login error:', error);
      setError(error?.message || 'Demo login failed. Please try again.');
      toast.error('Failed to log in with demo account');
    } finally {
      setLoginLoading(false);
    }
  };

  if (isLoading) {
    return <Loading fullPage text="Loading..." />;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="border-gov-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gov-blue-800">
              {language === 'english' ? 'Login to Gram Panchayat Kon' : 'ग्राम पंचायत कोन लॉगिन'}
            </CardTitle>
            <CardDescription>
              {language === 'english' 
                ? 'Access government services and track your applications' 
                : 'सरकारी सेवांचा वापर करा आणि आपल्या अर्जांचा मागोवा घ्या'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="mb-6">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login" className="flex items-center justify-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{language === 'english' ? 'Login' : 'लॉग इन'}</span>
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center justify-center">
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>{language === 'english' ? 'Sign Up' : 'साइन अप'}</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        <span>{language === 'english' ? 'Email' : 'ईमेल'}</span>
                      </div>
                    </Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder={language === 'english' ? 'Enter your email' : 'आपला ईमेल टाका'} 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">
                      <div className="flex items-center">
                        <Lock className="mr-2 h-4 w-4" />
                        <span>{language === 'english' ? 'Password' : 'पासवर्ड'}</span>
                      </div>
                    </Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder={language === 'english' ? 'Enter your password' : 'आपला पासवर्ड टाका'} 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginLoading}
                  >
                    {loginLoading 
                      ? (language === 'english' ? 'Logging in...' : 'लॉग इन होत आहे...') 
                      : (language === 'english' ? 'Login' : 'लॉग इन')}
                  </Button>
                </form>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="text-sm text-center text-gray-500">
                    <p>{language === 'english' ? 'Quick Demo Login:' : 'त्वरित डेमो लॉगिन:'}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full text-xs flex items-center justify-center"
                      onClick={() => handleDemoLogin('citizen')}
                      disabled={loginLoading}
                    >
                      <User className="mr-1 h-3 w-3" />
                      {language === 'english' ? 'Citizen' : 'नागरिक'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-xs flex items-center justify-center"
                      onClick={() => handleDemoLogin('staff')}
                      disabled={loginLoading}
                    >
                      <UserCog className="mr-1 h-3 w-3" />
                      {language === 'english' ? 'Staff' : 'कर्मचारी'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-xs flex items-center justify-center"
                      onClick={() => handleDemoLogin('admin')}
                      disabled={loginLoading}
                    >
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      {language === 'english' ? 'Admin' : 'प्रशासक'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="signup">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>{language === 'english' ? 'Full Name' : 'पूर्ण नाव'}</span>
                      </div>
                    </Label>
                    <Input 
                      id="signup-name" 
                      type="text" 
                      placeholder={language === 'english' ? 'Enter your full name' : 'आपले पूर्ण नाव टाका'} 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        <span>{language === 'english' ? 'Email' : 'ईमेल'}</span>
                      </div>
                    </Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder={language === 'english' ? 'Enter your email' : 'आपला ईमेल टाका'} 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">
                        <div className="flex items-center">
                          <Lock className="mr-2 h-4 w-4" />
                          <span>{language === 'english' ? 'Password' : 'पासवर्ड'}</span>
                        </div>
                      </Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder={language === 'english' ? 'Create password' : 'पासवर्ड तयार करा'} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">
                        <div className="flex items-center">
                          <Lock className="mr-2 h-4 w-4" />
                          <span>{language === 'english' ? 'Confirm' : 'पुष्टी करा'}</span>
                        </div>
                      </Label>
                      <Input 
                        id="signup-confirm-password" 
                        type="password" 
                        placeholder={language === 'english' ? 'Confirm password' : 'पासवर्डची पुष्टी करा'} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">
                      <span>{language === 'english' ? 'Phone (Optional)' : 'फोन (ऐच्छिक)'}</span>
                    </Label>
                    <Input 
                      id="signup-phone" 
                      type="tel" 
                      placeholder={language === 'english' ? 'Enter your phone number' : 'आपला फोन नंबर टाका'} 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-address">
                      <span>{language === 'english' ? 'Address (Optional)' : 'पत्ता (ऐच्छिक)'}</span>
                    </Label>
                    <Input 
                      id="signup-address" 
                      type="text" 
                      placeholder={language === 'english' ? 'Enter your address' : 'आपला पत्ता टाका'} 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>
                      <span>{language === 'english' ? 'Account Type' : 'खाते प्रकार'}</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        type="button"
                        variant={userRole === 'citizen' ? 'default' : 'outline'} 
                        className="w-full"
                        onClick={() => setUserRole('citizen')}
                      >
                        <User className="mr-2 h-4 w-4" />
                        {language === 'english' ? 'Citizen' : 'नागरिक'}
                      </Button>
                      <Button 
                        type="button"
                        variant={userRole === 'staff' ? 'default' : 'outline'} 
                        className="w-full"
                        onClick={() => setUserRole('staff')}
                      >
                        <UserCog className="mr-2 h-4 w-4" />
                        {language === 'english' ? 'Staff' : 'कर्मचारी'}
                      </Button>
                      <Button 
                        type="button"
                        variant={userRole === 'admin' ? 'default' : 'outline'} 
                        className="w-full"
                        onClick={() => setUserRole('admin')}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {language === 'english' ? 'Admin' : 'प्रशासक'}
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={signupLoading}
                  >
                    {signupLoading 
                      ? (language === 'english' ? 'Creating Account...' : 'खाते तयार करत आहे...') 
                      : (language === 'english' ? 'Create Account' : 'खाते तयार करा')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            <p>
              {language === 'english' 
                ? 'By signing up, you agree to our Terms of Service and Privacy Policy' 
                : 'साइन अप करून, आपण आमच्या सेवा अटी आणि गोपनीयता धोरणाशी सहमत आहात'}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
