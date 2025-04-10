
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { validateField, required, email } from '@/utils/formValidation';

const FeedbackForm = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({
    name: null as string | null,
    email: null as string | null,
    message: null as string | null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field on change
    const fieldError = name === 'name' 
      ? validateField(value, [required(language === 'english' ? 'Name is required' : 'नाव आवश्यक आहे')])
      : name === 'email'
      ? validateField(value, [
          required(language === 'english' ? 'Email is required' : 'ईमेल आवश्यक आहे'),
          email(language === 'english' ? 'Please enter a valid email' : 'कृपया वैध ईमेल प्रविष्ट करा')
        ])
      : validateField(value, [required(language === 'english' ? 'Message is required' : 'संदेश आवश्यक आहे')]);
    
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateField(formData.name, [
      required(language === 'english' ? 'Name is required' : 'नाव आवश्यक आहे')
    ]);
    
    const emailError = validateField(formData.email, [
      required(language === 'english' ? 'Email is required' : 'ईमेल आवश्यक आहे'),
      email(language === 'english' ? 'Please enter a valid email' : 'कृपया वैध ईमेल प्रविष्ट करा')
    ]);
    
    const messageError = validateField(formData.message, [
      required(language === 'english' ? 'Message is required' : 'संदेश आवश्यक आहे')
    ]);
    
    setErrors({
      name: nameError,
      email: emailError,
      message: messageError
    });
    
    if (!nameError && !emailError && !messageError) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setFormData({ name: '', email: '', message: '' });
        
        toast({
          title: language === 'english' ? 'Feedback Submitted' : 'अभिप्राय सबमिट केला',
          description: language === 'english' 
            ? 'Thank you for your feedback. We will get back to you soon.' 
            : 'आपल्या अभिप्रायासाठी धन्यवाद. आम्ही लवकरच आपल्याला संपर्क करू.',
          variant: 'default',
        });
      }, 1500);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={language === 'english' ? 'Your Name' : 'तुमचे नाव'}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      
      <div>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={language === 'english' ? 'Your Email' : 'तुमचा ईमेल'}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      
      <div>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={language === 'english' ? 'Your Message or Feedback' : 'तुमचा संदेश किंवा अभिप्राय'}
          className={errors.message ? 'border-red-500' : ''}
          rows={4}
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gov-blue-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {language === 'english' ? 'Submitting...' : 'सबमिट करत आहे...'}
          </span>
        ) : (
          <span className="flex items-center">
            <Send className="mr-2 h-4 w-4" />
            {language === 'english' ? 'Submit Feedback' : 'अभिप्राय सबमिट करा'}
          </span>
        )}
      </Button>
    </form>
  );
};

export default FeedbackForm;
