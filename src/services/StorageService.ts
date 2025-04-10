
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface StorageOptions {
  bucket: string;
  path?: string;
}

export class StorageService {
  static async uploadFile(file: File, options: StorageOptions): Promise<string | null> {
    try {
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = options.path ? `${options.path}/${fileName}` : fileName;
      
      const { error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get public URL for the uploaded file
      const { data } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return null;
    }
  }
  
  static async uploadMultipleFiles(files: File[], options: StorageOptions): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, options));
      const results = await Promise.all(uploadPromises);
      
      // Filter out null values from failed uploads
      return results.filter(url => url !== null) as string[];
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      toast.error('Failed to upload some files');
      return [];
    }
  }
  
  static async deleteFile(filePath: string, bucket: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      return false;
    }
  }
}
