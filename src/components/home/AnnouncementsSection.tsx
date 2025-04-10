
import { useState, useEffect } from 'react';
import { Bell, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import AnnouncementCard, { Announcement } from './AnnouncementCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loading } from '@/components/ui/loading';
import { AnnouncementController } from '@/controllers/AnnouncementController';

const AnnouncementsSection = () => {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch announcements from the database
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await AnnouncementController.getAnnouncements();
        
        if (error) throw error;
        
        setAnnouncements(data || []);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnnouncements();
    
    // Subscribe to real-time changes in announcements table
    const channel = AnnouncementController.subscribeToAnnouncements(() => {
      console.log('Real-time update received for announcements');
      fetchAnnouncements();
    });
    
    // Cleanup subscription when component unmounts
    return () => {
      AnnouncementController.unsubscribeFromChannel(channel);
    };
  }, []);
  
  // Get unique categories from announcements
  const categories = Array.from(new Set(announcements.map(a => a.category)));

  // Filter announcements based on selected category
  const filteredAnnouncements = filter 
    ? announcements.filter(a => a.category === filter) 
    : announcements;

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Bell className="text-gov-blue-600 mr-2" />
            <h2 className="text-2xl font-heading font-bold text-gov-blue-800">
              {language === 'english' ? 'Latest Announcements' : 'नवीनतम घोषणा'}
            </h2>
          </div>
          
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  {filter ? filter : language === 'english' ? 'All Categories' : 'सर्व श्रेणी'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => setFilter(null)}>
                  {language === 'english' ? 'All Categories' : 'सर्व श्रेणी'}
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setFilter(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loading size="lg" text={language === 'english' ? 'Loading announcements...' : 'घोषणा लोड करत आहे...'} />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {language === 'english' ? 'No announcements available' : 'कोणतीही घोषणा उपलब्ध नाही'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AnnouncementsSection;
