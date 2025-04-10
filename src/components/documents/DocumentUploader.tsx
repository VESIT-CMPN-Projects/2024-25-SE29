
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileCheck, Upload, X } from 'lucide-react';

interface DocumentUploaderProps {
  attachments: File[];
  setAttachments: React.Dispatch<React.SetStateAction<File[]>>;
}

const DocumentUploader = ({ attachments, setAttachments }: DocumentUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

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
    <div className="space-y-4">
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
        onClick={() => document.getElementById('document-file-upload')?.click()}
      >
        <input
          id="document-file-upload"
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
            Drag & drop files here or click to browse
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Upload all required documents as mentioned above
          </p>
        </div>
      </div>
      
      {attachments.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            Uploaded Files ({attachments.length})
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
  );
};

export default DocumentUploader;
