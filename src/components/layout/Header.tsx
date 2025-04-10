import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Settings, LayoutDashboard, Bell, UserCog, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { UserContext } from '@/App';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AdminDropdownItems = ({ language }: { language: 'english' | 'marathi' }) => {
  return (
    <>
      <DropdownMenuItem asChild>
        <Link to="/admin/announcements" className="cursor-pointer">
          <span className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            {language === 'english' ? 'Announcements' : 'घोषणा'}
          </span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/admin/staff" className="cursor-pointer">
          <span className="flex items-center">
            <UserCog className="mr-2 h-4 w-4" />
            {language === 'english' ? 'Staff Management' : 'कर्मचारी व्यवस्थापन'}
          </span>
        </Link>
      </DropdownMenuItem>
    </>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, isAuthenticated, logout } = useContext(UserContext);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <header 
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gov-blue-800 py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 relative overflow-hidden">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="Emblem of India" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className={`font-heading font-bold text-lg md:text-xl transition-colors duration-300 ${
                scrolled ? 'text-gov-blue-800' : 'text-white'
              }`}>
                {t('governmentTitle')}
              </h1>
              <p className={`text-xs md:text-sm font-medium transition-colors duration-300 ${
                scrolled ? 'text-gov-blue-600' : 'text-gov-gold-300'
              }`}>
                {language === 'english' ? 'Thane District, Maharashtra' : 'ठाणे जिल्हा, महाराष्ट्र'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`font-medium transition-colors hover:text-gov-gold-400 ${
                scrolled ? 'text-gov-blue-700' : 'text-white'
              }`}
            >
              {t('home')}
            </Link>
            <Link 
              to="/complaints" 
              className={`font-medium transition-colors hover:text-gov-gold-400 ${
                scrolled ? 'text-gov-blue-700' : 'text-white'
              }`}
            >
              {t('complaints')}
            </Link>
            <Link 
              to="/documents" 
              className={`font-medium transition-colors hover:text-gov-gold-400 ${
                scrolled ? 'text-gov-blue-700' : 'text-white'
              }`}
            >
              {t('documents')}
            </Link>
            <Link 
              to="/track" 
              className={`font-medium transition-colors hover:text-gov-gold-400 ${
                scrolled ? 'text-gov-blue-700' : 'text-white'
              }`}
            >
              {t('track')}
            </Link>
            <Link 
              to="/notices" 
              className={`font-medium transition-colors hover:text-gov-gold-400 ${
                scrolled ? 'text-gov-blue-700' : 'text-white'
              }`}
            >
              {t('notices')}
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors hover:text-gov-gold-400 ${
                scrolled ? 'text-gov-blue-700' : 'text-white'
              }`}
            >
              {t('about')}
            </Link>
            
            {isAuthenticated && (user?.role === 'staff' || user?.role === 'admin') && (
              <Link 
                to="/dashboard" 
                className={`font-medium transition-colors hover:text-gov-gold-400 ${
                  scrolled ? 'text-gov-blue-700' : 'text-white'
                }`}
              >
                {t('dashboard')}
              </Link>
            )}
          </nav>

          {/* Language Switcher and Login/User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSwitcher />
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`flex items-center space-x-2 ${
                      scrolled 
                        ? 'text-gov-blue-700 hover:bg-gov-blue-50 hover:text-gov-blue-800' 
                        : 'text-white hover:bg-gov-blue-700'
                    }`}
                  >
                    <Avatar className={`h-8 w-8 ${getAvatarColor(user.role)}`}>
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('profile')}</span>
                    </DropdownMenuItem>
                    
                    {(user.role === 'staff' || user.role === 'admin') && (
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>{t('dashboard')}</span>
                      </DropdownMenuItem>
                    )}
                    
                    {user.role === 'admin' && (
                      <AdminDropdownItems language={language} />
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => navigate('/login')}
                className={`flex items-center space-x-2 ${
                  scrolled 
                    ? 'bg-gov-blue-600 hover:bg-gov-blue-700 text-white' 
                    : 'bg-gov-gold-500 hover:bg-gov-gold-600 text-gov-blue-900'
                }`}
              >
                <User size={16} />
                <span>{t('login')}</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button 
              className="p-2 rounded-md focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className={scrolled ? 'text-gov-blue-800' : 'text-white'} size={24} />
              ) : (
                <Menu className={scrolled ? 'text-gov-blue-800' : 'text-white'} size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slideInFromTop">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className={`font-medium transition-colors p-2 rounded-md ${
                  scrolled 
                    ? 'text-gov-blue-700 hover:bg-gov-blue-50' 
                    : 'text-white hover:bg-gov-blue-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link 
                to="/complaints" 
                className={`font-medium transition-colors p-2 rounded-md ${
                  scrolled 
                    ? 'text-gov-blue-700 hover:bg-gov-blue-50' 
                    : 'text-white hover:bg-gov-blue-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('complaints')}
              </Link>
              <Link 
                to="/documents" 
                className={`font-medium transition-colors p-2 rounded-md ${
                  scrolled 
                    ? 'text-gov-blue-700 hover:bg-gov-blue-50' 
                    : 'text-white hover:bg-gov-blue-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('documents')}
              </Link>
              <Link 
                to="/track" 
                className={`font-medium transition-colors p-2 rounded-md ${
                  scrolled 
                    ? 'text-gov-blue-700 hover:bg-gov-blue-50' 
                    : 'text-white hover:bg-gov-blue-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('track')}
              </Link>
              <Link 
                to="/notices" 
                className={`font-medium transition-colors p-2 rounded-md ${
                  scrolled 
                    ? 'text-gov-blue-700 hover:bg-gov-blue-50' 
                    : 'text-white hover:bg-gov-blue-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('notices')}
              </Link>
              <Link 
                to="/about" 
                className={`font-medium transition-colors p-2 rounded-md ${
                  scrolled 
                    ? 'text-gov-blue-700 hover:bg-gov-blue-50' 
                    : 'text-white hover:bg-gov-blue-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('about')}
              </Link>
              
              {isAuthenticated && (user?.role === 'staff' || user?.role === 'admin') && (
                <Link 
                  to="/dashboard" 
                  className={`font-medium transition-colors p-2 rounded-md ${
                    scrolled 
                      ? 'text-gov-blue-700 hover:bg-gov-blue-50' 
                      : 'text-white hover:bg-gov-blue-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4 inline" />
                  <span>{t('dashboard')}</span>
                </Link>
              )}
              
              {isAuthenticated && user ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`font-medium transition-colors p-2 rounded-md ${
                      scrolled 
                        ? 'text-gov-blue-700 hover:bg-gov-blue-50' 
                        : 'text-white hover:bg-gov-blue-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4 inline" />
                    <span>{t('profile')}</span>
                  </Link>
                  
                  {user.role === 'admin' && (
                    <>
                      <Link 
                        to="/admin/staff" 
                        className={`font-medium transition-colors p-2 rounded-md ${
                          scrolled 
                            ? 'text-gov-blue-700 hover:bg-gov-blue-50' 
                            : 'text-white hover:bg-gov-blue-700'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserCog className="mr-2 h-4 w-4 inline" />
                        <span>{t('manageStaff')}</span>
                      </Link>
                      <Link 
                        to="/admin/announcements" 
                        className={`font-medium transition-colors p-2 rounded-md ${
                          scrolled 
                            ? 'text-gov-blue-700 hover:bg-gov-blue-50' 
                            : 'text-white hover:bg-gov-blue-700'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Bell className="mr-2 h-4 w-4 inline" />
                        <span>{t('manageAnnouncements')}</span>
                      </Link>
                    </>
                  )}
                  
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center justify-center space-x-2 w-full ${
                    scrolled 
                      ? 'bg-gov-blue-600 hover:bg-gov-blue-700 text-white' 
                      : 'bg-gov-gold-500 hover:bg-gov-gold-600 text-gov-blue-900'
                  }`}
                >
                  <User size={16} />
                  <span>{t('login')}</span>
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
