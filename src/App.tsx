import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { User, UserRole } from "@/model";
import { LanguageProvider } from "./contexts/LanguageContext";
import { supabase } from "./integrations/supabase/client";
import { toast } from "sonner";
import { Loading } from "./components/ui/loading";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Complaints from "./pages/Complaints";
import Documents from "./pages/Documents";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Track from "./pages/Track";
import About from "./pages/About";
import Notices from "./pages/Notices";
import StaffManagement from "./pages/admin/StaffManagement";
import AnnouncementManagement from "./pages/admin/AnnouncementManagement";

// Layout components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProfileSettings from "./pages/ProfileSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000, // 30 seconds
    },
  },
});

// Create a user context
export const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (email: string, password: string, userData: Partial<User>) => Promise<User | null>;
  logout: () => Promise<void>;
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  isLoading: true,
  login: async () => null,
  signup: async () => null,
  logout: async () => {},
});

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authActionInProgress, setAuthActionInProgress] = useState<boolean>(false);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          // Show loading overlay during auth state changes
          setAuthActionInProgress(true);
        }
        
        setIsLoading(true);
        
        if (session?.user) {
          try {
            // Get user profile from database
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error('Error fetching profile:', error);
              
              // If no profile found but user is authenticated, create a profile
              if (error.code === 'PGRST116') {
                const { data: userData } = await supabase.auth.getUser();
                if (userData?.user) {
                  const defaultRole = 'citizen';
                  
                  const { data: newProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                      id: userData.user.id,
                      name: userData.user.user_metadata?.name || 'User',
                      email: userData.user.email || '',
                      role: userData.user.user_metadata?.role || defaultRole,
                      phone: userData.user.user_metadata?.phone || '',
                      address: userData.user.user_metadata?.address || ''
                    })
                    .select()
                    .single();
                    
                  if (insertError) {
                    throw insertError;
                  }
                  
                  if (newProfile) {
                    const userData: User = {
                      id: newProfile.id,
                      name: newProfile.name,
                      email: newProfile.email,
                      role: newProfile.role as UserRole,
                      phone: newProfile.phone || undefined,
                      address: newProfile.address || undefined,
                    };
                    setUser(userData);
                    setIsAuthenticated(true);
                  }
                }
              } else {
                throw error;
              }
            } else if (profile) {
              const userData: User = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole,
                phone: profile.phone || undefined,
                address: profile.address || undefined,
              };
              
              setUser(userData);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Error loading user profile. Please try logging in again.');
            // Force sign out on critical errors
            await supabase.auth.signOut();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
        // Remove loading overlay after auth state is processed
        setTimeout(() => setAuthActionInProgress(false), 500);
      }
    );

    // Initial session check
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        // Get user profile from database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.warn('Profile not found for authenticated user');
            // We'll handle creating the profile in the auth state change listener
          } else {
            throw error;
          }
        }

        if (profile) {
          const userData: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole,
            phone: profile.phone || undefined,
            address: profile.address || undefined,
          };
          
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function with Supabase
  const login = async (email: string, password: string): Promise<User | null> => {
    setAuthActionInProgress(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          const userData: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole,
            phone: profile.phone || undefined,
            address: profile.address || undefined,
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          
          toast.success(`Welcome back, ${userData.name}!`);
          return userData;
        }
      }
      
      return null;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
      return null;
    } finally {
      setAuthActionInProgress(false);
    }
  };

  // Signup function with Supabase
  const signup = async (email: string, password: string, userData: Partial<User>): Promise<User | null> => {
    setAuthActionInProgress(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'citizen',
            phone: userData.phone,
            address: userData.address,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Account created successfully!');
        toast.info('You can now log in with your credentials');
        
        // The profile will be created by the database trigger
        return {
          id: data.user.id,
          email,
          name: userData.name || 'User',
          role: userData.role || 'citizen',
          phone: userData.phone,
          address: userData.address,
        };
      }
      
      return null;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      return null;
    } finally {
      setAuthActionInProgress(false);
    }
  };

  // Logout function
  const logout = async () => {
    setAuthActionInProgress(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('You have been logged out');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
    } finally {
      setAuthActionInProgress(false);
    }
  };

  // Protected route component
  const ProtectedRoute = ({ 
    children, 
    allowedRoles = ['citizen', 'staff', 'admin'] 
  }: { 
    children: React.ReactNode;
    allowedRoles?: UserRole[];
  }) => {
    if (isLoading) {
      return <Loading fullPage text="Loading..." />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (user && allowedRoles.includes(user.role)) {
      return <>{children}</>;
    }

    return <Navigate to="/" />;
  };

  // Staff/Admin protected route
  const StaffRoute = ({ children }: { children: React.ReactNode }) => {
    return (
      <ProtectedRoute allowedRoles={['staff', 'admin']}>
        {children}
      </ProtectedRoute>
    );
  };

  // Admin only route
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        {children}
      </ProtectedRoute>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <UserContext.Provider value={{ 
            user, 
            setUser, 
            isAuthenticated, 
            isLoading, 
            login, 
            signup, 
            logout 
          }}>
            <Toaster />
            <Sonner />
            {authActionInProgress && (
              <Loading overlay text="Processing..." timeout={5000} />
            )}
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-24 pb-12">
                  {isLoading ? (
                    <Loading fullPage text="Loading..." timeout={10000} />
                  ) : (
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/complaints" element={<Complaints />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/dashboard" element={
                        <StaffRoute>
                          <Dashboard />
                        </StaffRoute>
                      } />
                      <Route path="/login" element={<Login />} />
                      <Route path="/track" element={<Track />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/notices" element={<Notices />} />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <ProfileSettings />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/staff" element={
                        <AdminRoute>
                          <StaffManagement />
                        </AdminRoute>
                      } />
                      <Route path="/admin/announcements" element={
                        <AdminRoute>
                          <AnnouncementManagement />
                        </AdminRoute>
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  )}
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </UserContext.Provider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
