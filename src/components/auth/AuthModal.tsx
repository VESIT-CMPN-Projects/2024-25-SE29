import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/model';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LoaderCircle, User, Lock, Mail, Phone, ShieldCheck, UserCog } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { loginWithDemo } from '@/integrations/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string, role: UserRole) => void;
  onRegister: (name: string, email: string, password: string, phone: string, role: UserRole) => void;
}

const AuthModal = ({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginRole, setLoginRole] = useState<UserRole>('citizen');
  
  // Register form state
  const [registerName, setRegisterName] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState<string>('');
  const [registerPhone, setRegisterPhone] = useState<string>('');
  const [registerRole, setRegisterRole] = useState<UserRole>('citizen');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin(loginEmail, loginPassword, loginRole);
      toast.success('Login successful!');
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword || !registerPhone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      onRegister(registerName, registerEmail, registerPassword, registerPhone, registerRole);
      toast.success('Registration successful!');
      setActiveTab('login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setLoading(true);
    
    try {
      const { data, error } = await loginWithDemo(role);
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        toast.success(`Welcome, Demo ${role.charAt(0).toUpperCase() + role.slice(1)}!`);
        onClose();
      }
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast.error(error?.message || 'Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-heading text-gov-blue-800">Gram Panchayat Kon</SheetTitle>
          <SheetDescription>
            Access government services and track your applications
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-role">Login As</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={loginRole === 'citizen' ? 'default' : 'outline'}
                    onClick={() => setLoginRole('citizen')}
                    className="w-full"
                  >
                    Citizen
                  </Button>
                  <Button
                    type="button"
                    variant={loginRole === 'staff' ? 'default' : 'outline'}
                    onClick={() => setLoginRole('staff')}
                    className="w-full"
                  >
                    Staff
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6 bg-gov-blue-600 hover:bg-gov-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Login'
                )}
              </Button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  className="text-sm text-gov-blue-600 hover:text-gov-blue-800"
                  onClick={() => setActiveTab('register')}
                >
                  Don't have an account? Register now
                </button>
              </div>
            </form>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="text-sm text-center text-gray-500">
                <p>Quick Demo Login:</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => handleDemoLogin('citizen')}
                  disabled={loading}
                >
                  <User className="mr-1 h-3 w-3" />
                  Citizen
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => handleDemoLogin('staff')}
                  disabled={loading}
                >
                  <UserCog className="mr-1 h-3 w-3" />
                  Staff
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={loading}
                >
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Admin
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    id="register-name"
                    placeholder="Enter your full name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    id="register-phone"
                    placeholder="Enter your phone number"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-role">Register As</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={registerRole === 'citizen' ? 'default' : 'outline'}
                    onClick={() => setRegisterRole('citizen')}
                    className="w-full"
                  >
                    Citizen
                  </Button>
                  <Button
                    type="button"
                    variant={registerRole === 'staff' ? 'default' : 'outline'}
                    onClick={() => setRegisterRole('staff')}
                    className="w-full"
                  >
                    Staff
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6 bg-gov-blue-600 hover:bg-gov-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Register'
                )}
              </Button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  className="text-sm text-gov-blue-600 hover:text-gov-blue-800"
                  onClick={() => setActiveTab('login')}
                >
                  Already have an account? Login
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default AuthModal;
