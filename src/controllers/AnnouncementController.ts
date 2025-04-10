
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/model';
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

export interface AnnouncementData {
  id?: string;
  title: string;
  content: string;
  category: string;
  important: boolean;
  created_by?: string;
}

export class AnnouncementController {
  static async getAnnouncements(): Promise<{data: Announcement[] | null, error: PostgrestError | null}> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform to match our Announcement interface
      const formattedData = data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        date: new Date(item.created_at),
        category: item.category,
        important: item.important,
        link: `/announcements/${item.id}`
      }));
      
      return { data: formattedData, error: null };
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return { data: null, error: error as PostgrestError };
    }
  }

  static async getAnnouncementById(id: string): Promise<{data: Announcement | null, error: PostgrestError | null}> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        return { data: null, error: null };
      }
      
      // Transform to match our Announcement interface
      const formattedData = {
        id: data.id,
        title: data.title,
        content: data.content,
        date: new Date(data.created_at),
        category: data.category,
        important: data.important
      };
      
      return { data: formattedData, error: null };
    } catch (error) {
      console.error(`Error fetching announcement with ID ${id}:`, error);
      return { data: null, error: error as PostgrestError };
    }
  }

  static async createAnnouncement(announcement: AnnouncementData): Promise<{success: boolean, error: PostgrestError | null}> {
    try {
      const { error } = await supabase
        .from('announcements')
        .insert(announcement);
        
      if (error) throw error;
      
      toast.success('Announcement created successfully');
      return { success: true, error: null };
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
      return { success: false, error: error as PostgrestError };
    }
  }

  static async updateAnnouncement(id: string, announcement: AnnouncementData): Promise<{success: boolean, error: PostgrestError | null}> {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({
          title: announcement.title,
          content: announcement.content,
          category: announcement.category,
          important: announcement.important,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Announcement updated successfully');
      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
      return { success: false, error: error as PostgrestError };
    }
  }

  static async deleteAnnouncement(id: string): Promise<{success: boolean, error: PostgrestError | null}> {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Announcement deleted successfully');
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
      return { success: false, error: error as PostgrestError };
    }
  }
  
  static subscribeToAnnouncements(callback: () => void) {
    const channel = supabase
      .channel('announcements_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'announcements' 
        }, 
        () => {
          callback();
        }
      )
      .subscribe();
      
    return channel;
  }
  
  static unsubscribeFromChannel(channel: any) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  }
}
