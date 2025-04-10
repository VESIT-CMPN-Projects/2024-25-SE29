
import { useState } from 'react';
import { Bell, Calendar, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
  category: string;
  important: boolean;
  link?: string;
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  const { language } = useLanguage();
  const [showFullContent, setShowFullContent] = useState(false);
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'infrastructure':
      case 'public_works':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'governance':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'education':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'agriculture':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'emergency':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'event':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    try {
      return format(date, 'PPP');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Create a truncated version of the content for the card preview
  const truncatedContent = announcement.content.length > 120 
    ? `${announcement.content.substring(0, 120)}...` 
    : announcement.content;

  return (
    <>
      <Card className={`overflow-hidden transition-all hover:shadow-md ${
        announcement.important ? 'border-l-4 border-l-red-500' : ''
      }`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge className={getCategoryColor(announcement.category)} variant="secondary">
              {announcement.category.replace('_', ' ')}
            </Badge>
            {announcement.important && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {language === 'english' ? 'Important' : 'महत्त्वाचे'}
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg md:text-xl font-heading mt-2">
            {announcement.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{truncatedContent}</p>
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(announcement.date)}</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            className="px-0 text-gov-blue-600 hover:text-gov-blue-800 font-medium"
            onClick={() => setShowFullContent(true)}
          >
            {language === 'english' ? 'Read more' : 'अधिक वाचा'} <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showFullContent} onOpenChange={setShowFullContent}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className={getCategoryColor(announcement.category)} variant="secondary">
                {announcement.category.replace('_', ' ')}
              </Badge>
              {announcement.important && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {language === 'english' ? 'Important' : 'महत्त्वाचे'}
                </Badge>
              )}
            </div>
            <DialogTitle className="text-xl font-heading text-gov-blue-800">{announcement.title}</DialogTitle>
            <DialogDescription className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(announcement.date)}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="prose max-w-none">
              {announcement.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">
                {language === 'english' ? 'Close' : 'बंद करा'}
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnnouncementCard;
