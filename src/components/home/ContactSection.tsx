
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackForm from '@/components/common/FeedbackForm';

const ContactSection = () => {
  const { language } = useLanguage();
  
  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5 text-gov-blue-500" />,
      title: language === 'english' ? 'Phone' : 'फोन',
      value: '+91 2352 247100',
      link: 'tel:+912352247100'
    },
    {
      icon: <Mail className="h-5 w-5 text-gov-blue-500" />,
      title: language === 'english' ? 'Email' : 'ईमेल',
      value: 'grampanchayat.kon@gov.in',
      link: 'mailto:grampanchayat.kon@gov.in'
    },
    {
      icon: <MapPin className="h-5 w-5 text-gov-blue-500" />,
      title: language === 'english' ? 'Address' : 'पत्ता',
      value: language === 'english' 
        ? 'Gram Panchayat Office, Kon Village, Maharashtra - 415804' 
        : 'ग्राम पंचायत कार्यालय, कोन गाव, महाराष्ट्र - ४१५८०४',
      link: 'https://g.co/kgs/nMbEwyR'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gov-blue-800 mb-4">
            {language === 'english' ? 'Contact Us' : 'आमच्याशी संपर्क साधा'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === 'english'
              ? 'Get in touch with the Gram Panchayat with your questions or feedback'
              : 'तुमच्या प्रश्नांसह किंवा अभिप्रायासह ग्राम पंचायतीशी संपर्क साधा'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((item, index) => (
                <a 
                  key={index}
                  href={item.link}
                  className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gov-blue-300 hover:shadow transition-all"
                >
                  <div className="flex items-center mb-3">
                    {item.icon}
                    <h3 className="font-medium text-gray-700 ml-2">{item.title}</h3>
                  </div>
                  <p className="text-gov-blue-700">{item.value}</p>
                </a>
              ))}
            </div>
            
            <div className="rounded-lg overflow-hidden h-64 shadow-md">
             
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7533.577319304264!2d73.1076033!3d19.24804025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7960a2411e2dd%3A0x9b6fce1ce2a9d8cb!2sKongaon%2C%20Maharashtra%20421311!5e0!3m2!1sen!2sin!4v1744300208772!5m2!1sen!2sin" 
             width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Kon Village Map">
          
                </iframe>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-gov-blue-600" />
                  {language === 'english' ? 'Send us a Message' : 'आम्हाला संदेश पाठवा'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FeedbackForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
