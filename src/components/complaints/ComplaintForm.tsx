
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { complaintCategories } from '@/data/services';
import { Complaint } from '@/model';
import { LoaderCircle, Upload, X, FileCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface ComplaintFormProps {
  onSubmit: (complaint: Omit<Complaint, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'assignedTo' | 'comments'>) => void;
  isSubmitting?: boolean;
}

const ComplaintForm = ({ onSubmit, isSubmitting = false }: ComplaintFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      toast.error(language === 'english' ? 'Please fill in all required fields' : 'कृपया सर्व आवश्यक क्षेत्रे भरा');
      return;
    }
    
    // In a real app, we would upload the attachments and get their URLs
    const attachmentUrls = attachments.map((file) => URL.createObjectURL(file));
    
    onSubmit({
      title,
      description,
      category,
      location,
      attachments: attachmentUrls,
    });
    
    // Reset form after submission
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setAttachments([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              {language === 'english' ? 'Complaint Title' : 'तक्रार शीर्षक'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder={language === 'english' ? "Enter a brief title for your complaint" : "आपल्या तक्रारीसाठी संक्षिप्त शीर्षक प्रविष्ट करा"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="hover:border-gov-blue-300 focus-visible:ring-gov-blue-300"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-medium">
              {language === 'english' ? 'Category' : 'श्रेणी'} <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={category} 
              onValueChange={setCategory}
              required
            >
              <SelectTrigger className="hover:border-gov-blue-300 focus:ring-gov-blue-300">
                <SelectValue placeholder={language === 'english' ? "Select a category" : "श्रेणी निवडा"} />
              </SelectTrigger>
              <SelectContent>
                {complaintCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base font-medium">
              {language === 'english' ? 'Location' : 'स्थान'}
            </Label>
            <Input
              id="location"
              placeholder={language === 'english' ? "Enter location details (optional)" : "स्थान तपशील प्रविष्ट करा (वैकल्पिक)"}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="hover:border-gov-blue-300 focus-visible:ring-gov-blue-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              {language === 'english' ? 'Complaint Description' : 'तक्रार वर्णन'} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder={language === 'english' ? "Please provide detailed information about your complaint" : "कृपया आपल्या तक्रारीबद्दल तपशीलवार माहिती प्रदान करा"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[150px] hover:border-gov-blue-300 focus-visible:ring-gov-blue-300"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-base font-medium">
              {language === 'english' ? 'Attachments (Optional)' : 'संलग्नके (वैकल्पिक)'}
            </Label>
            <div
              className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition-colors ${
                isDragging 
                  ? 'border-gov-blue-400 bg-gov-blue-50' 
                  : 'border-gray-300 hover:border-gov-blue-300'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center">
                <Upload 
                  className={`mb-2 ${isDragging ? 'text-gov-blue-500' : 'text-gray-400'}`} 
                  size={36} 
                />
                <p className="font-medium text-gray-700">
                  {language === 'english' ? 'Drag & drop files here or click to browse' : 'फाइल्स येथे ड्रॅग आणि ड्रॉप करा किंवा ब्राउझ करण्यासाठी क्लिक करा'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {language === 'english' ? 'Upload images or documents related to your complaint' : 'आपल्या तक्रारीशी संबंधित प्रतिमा किंवा दस्तऐवज अपलोड करा'}
                </p>
              </div>
            </div>
            
            {attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  {language === 'english' ? `Uploaded Files (${attachments.length})` : `अपलोड केलेल्या फाइल्स (${attachments.length})`}
                </h4>
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <FileCheck className="text-green-500" size={18} />
                        <span className="text-sm text-gray-700 truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="text-gray-500 hover:text-red-500" size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gov-blue-600 hover:bg-gov-blue-700 text-white transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {language === 'english' ? 'Submitting...' : 'सादर करत आहे...'}
              </>
            ) : (
              language === 'english' ? 'Submit Complaint' : 'तक्रार सादर करा'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComplaintForm;
