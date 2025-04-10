
import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 px-2 py-1"
        >
          <Globe size={16} />
          <span className="hidden sm:inline">
            {language === 'english' ? 'EN' : 'मराठी'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('english')}>
          <div className="flex items-center">
            {language === 'english' && <span className="mr-2">✓</span>}
            <span className={language === 'english' ? 'font-medium' : ''}>English</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('marathi')}>
          <div className="flex items-center">
            {language === 'marathi' && <span className="mr-2">✓</span>}
            <span className={language === 'marathi' ? 'font-medium' : ''}>मराठी (Marathi)</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
