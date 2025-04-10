
import { supabase } from '@/integrations/supabase/client';
import { StaffPerformance } from '@/model';
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

export class StaffController {
  static async getStaffPerformance(): Promise<{data: StaffPerformance[] | null, error: PostgrestError | null}> {
    try {
      // Get all staff members
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*, profiles:user_id(name)');
      
      if (staffError) throw staffError;
      
      // For each staff member, get their performance metrics
      const performancePromises = staffData.map(async (staff) => {
        // Get complaints resolved count
        const { count: complaintsResolved, error: complaintsError } = await supabase
          .from('complaints')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', staff.user_id)
          .eq('status', 'resolved');
          
        if (complaintsError) throw complaintsError;
        
        // Get documents reviewed count (verified)
        const { count: documentsVerified, error: verifiedError } = await supabase
          .from('document_requests')
          .select('*', { count: 'exact', head: true })
          .eq('verified_by', staff.user_id);
          
        if (verifiedError) throw verifiedError;
        
        // Get documents approved count
        const { count: documentsApproved, error: approvedError } = await supabase
          .from('document_requests')
          .select('*', { count: 'exact', head: true })
          .eq('approved_by', staff.user_id);
          
        if (approvedError) throw approvedError;
        
        // Safely handle the profile data, checking for null and correct shape
        let profileName = 'Unknown';
        
        // First check if profiles exists and is not null
        if (staff.profiles) {
          // Use type assertion with unknown as an intermediate step
          const profilesData = staff.profiles as unknown;
          // Then check if it's an object and has a name property
          if (profilesData && 
              typeof profilesData === 'object' && 
              profilesData !== null && 
              'name' in profilesData && 
              typeof profilesData.name === 'string') {
            profileName = profilesData.name;
          }
        }
        
        return {
          staffId: staff.user_id,
          staffName: profileName,
          complaintsResolved: complaintsResolved || 0,
          documentsReviewed: documentsVerified || 0,
          documentsApproved: documentsApproved || 0,
          lastActive: new Date(staff.joined_at) // We should ideally track last activity
        };
      });
      
      const staffPerformance = await Promise.all(performancePromises);
      return { data: staffPerformance, error: null };
    } catch (error) {
      console.error('Error fetching staff performance:', error);
      return { data: null, error: error as PostgrestError };
    }
  }

  static async toggleStaffStatus(staffId: string, isActive: boolean): Promise<{success: boolean, error: PostgrestError | null}> {
    try {
      const { error } = await supabase
        .from('staff')
        .update({ is_active: !isActive })
        .eq('id', staffId);
        
      if (error) throw error;
      
      toast.success(`Staff member ${isActive ? 'deactivated' : 'activated'} successfully`);
      return { success: true, error: null };
    } catch (error) {
      console.error('Error toggling staff status:', error);
      toast.error('Failed to update staff status');
      return { success: false, error: error as PostgrestError };
    }
  }

  static async removeStaffMember(staffId: string, userId: string): Promise<{success: boolean, error: PostgrestError | null}> {
    try {
      // Delete staff record
      const { error: staffError } = await supabase
        .from('staff')
        .delete()
        .eq('id', staffId);

      if (staffError) throw staffError;
      
      // Update user role back to citizen
      const { error: userError } = await supabase
        .from('profiles')
        .update({ role: 'citizen' })
        .eq('id', userId);

      if (userError) throw userError;
      
      toast.success('Staff member removed successfully');
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error removing staff member:', error);
      toast.error('Failed to remove staff member');
      return { success: false, error: error as PostgrestError };
    }
  }
}
