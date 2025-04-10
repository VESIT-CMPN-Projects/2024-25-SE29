
import { useEffect, useState } from 'react';
import { Users, FileText, Building, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import useScrollAnimation from '@/hooks/use-scroll-animation';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  animationDelay: number;
  inView: boolean;
}

const StatItem = ({ icon, value, label, animationDelay, inView }: StatItemProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev >= value) {
            clearInterval(interval);
            return value;
          }
          return prev + Math.ceil(value / 20);
        });
      }, 50);
      
      return () => clearInterval(interval);
    }, animationDelay);
    
    return () => clearTimeout(timeout);
  }, [value, animationDelay, inView]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gov-blue-100 flex items-center justify-center text-gov-blue-600">
          {icon}
        </div>
        <div>
          <p className="text-3xl font-bold text-gov-blue-800">{count}</p>
          <p className="text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
};

const StatsSection = () => {
  const { language } = useLanguage();
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  
  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      value: 5267,
      label: language === 'english' ? 'Village Population' : 'गावाची लोकसंख्या',
      animationDelay: 0
    },
    {
      icon: <FileText className="h-6 w-6" />,
      value: 152,
      label: language === 'english' ? 'Complaints Resolved' : 'निराकरण केलेल्या तक्रारी',
      animationDelay: 200
    },
    {
      icon: <Building className="h-6 w-6" />,
      value: 24,
      label: language === 'english' ? 'Ongoing Projects' : 'चालू प्रकल्प',
      animationDelay: 400
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      value: 316,
      label: language === 'english' ? 'Documents Processed' : 'प्रक्रिया केलेले दस्तऐवज',
      animationDelay: 600
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gov-blue-800 mb-4">
            {language === 'english' ? 'Kon Village at a Glance' : 'कोन गावाचा एक दृष्टिक्षेप'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === 'english'
              ? 'Key statistics and achievements of our Gram Panchayat'
              : 'आमच्या ग्राम पंचायतीची प्रमुख आकडेवारी आणि यश'}
          </p>
        </div>
        
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatItem 
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              animationDelay={stat.animationDelay}
              inView={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
