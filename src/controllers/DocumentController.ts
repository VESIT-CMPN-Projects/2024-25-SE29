
import { supabase } from '@/integrations/supabase/client';
import { DocumentRequest, DocumentStatus, DocumentType } from '@/model';
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export class DocumentController {
  static async getDocumentRequests(): Promise<{data: DocumentRequest[] | null, error: PostgrestError | null}> {
    try {
      const { data, error } = await supabase
        .from('document_requests')
        .select(`
          *,
          profiles:user_id(name),
          verified_profiles:verified_by(name),
          approved_profiles:approved_by(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our DocumentRequest interface
      const formattedData = data.map(item => {
        // Handle potentially null or error profiles safely
        let userName = null;
        if (item.profiles) {
          // Use type assertion with unknown as an intermediate step
          const profiles = item.profiles as unknown;
          // Then check if it's an object and has a name property
          if (profiles && typeof profiles === 'object' && profiles !== null && 'name' in profiles && typeof profiles.name === 'string') {
            userName = profiles.name;
          }
        }
          
        let verifiedByName = null;
        if (item.verified_profiles) {
          // Use type assertion with unknown as an intermediate step
          const verifiedProfiles = item.verified_profiles as unknown;
          // Then check if it's an object and has a name property
          if (verifiedProfiles && typeof verifiedProfiles === 'object' && verifiedProfiles !== null && 'name' in verifiedProfiles && typeof verifiedProfiles.name === 'string') {
            verifiedByName = verifiedProfiles.name;
          }
        }
        
        let approvedByName = null;
        if (item.approved_profiles) {
          // Use type assertion with unknown as an intermediate step
          const approvedProfiles = item.approved_profiles as unknown;
          // Then check if it's an object and has a name property
          if (approvedProfiles && typeof approvedProfiles === 'object' && approvedProfiles !== null && 'name' in approvedProfiles && typeof approvedProfiles.name === 'string') {
            approvedByName = approvedProfiles.name;
          }
        }
        
        // Safely access form_details with a fallback
        let formDetails = {};
        if (item.form_details && typeof item.form_details === 'object') {
          formDetails = item.form_details as Record<string, any>;
        }
        
        return {
          id: item.id,
          userId: item.user_id,
          userName: userName,
          documentType: item.document_type as DocumentType,
          purpose: item.purpose,
          status: item.status as DocumentStatus,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          attachments: item.attachments || [],
          verifiedBy: item.verified_by,
          verifiedByName: verifiedByName,
          approvedBy: item.approved_by,
          approvedByName: approvedByName,
          rejectionReason: item.rejection_reason,
          additionalNotes: item.additional_notes,
          formDetails: formDetails
        };
      });

      return { data: formattedData, error: null };
    } catch (error) {
      console.error('Error fetching document requests:', error);
      return { data: null, error: error as PostgrestError };
    }
  }

  static async getUserDocumentRequests(userId: string): Promise<{data: DocumentRequest[] | null, error: PostgrestError | null}> {
    try {
      const { data, error } = await supabase
        .from('document_requests')
        .select(`
          *,
          profiles:user_id(name),
          verified_profiles:verified_by(name),
          approved_profiles:approved_by(name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedData = data.map(item => {
        // Handle potentially null or error profiles safely
        let userName = null;
        if (item.profiles) {
          // Use type assertion with unknown as an intermediate step
          const profiles = item.profiles as unknown;
          // Then check if it's an object and has a name property
          if (profiles && typeof profiles === 'object' && profiles !== null && 'name' in profiles && typeof profiles.name === 'string') {
            userName = profiles.name;
          }
        }
          
        let verifiedByName = null;
        if (item.verified_profiles) {
          // Use type assertion with unknown as an intermediate step
          const verifiedProfiles = item.verified_profiles as unknown;
          // Then check if it's an object and has a name property
          if (verifiedProfiles && typeof verifiedProfiles === 'object' && verifiedProfiles !== null && 'name' in verifiedProfiles && typeof verifiedProfiles.name === 'string') {
            verifiedByName = verifiedProfiles.name;
          }
        }
        
        let approvedByName = null;
        if (item.approved_profiles) {
          // Use type assertion with unknown as an intermediate step
          const approvedProfiles = item.approved_profiles as unknown;
          // Then check if it's an object and has a name property
          if (approvedProfiles && typeof approvedProfiles === 'object' && approvedProfiles !== null && 'name' in approvedProfiles && typeof approvedProfiles.name === 'string') {
            approvedByName = approvedProfiles.name;
          }
        }
        
        // Safely access form_details with a fallback
        let formDetails = {};
        if (item.form_details && typeof item.form_details === 'object') {
          formDetails = item.form_details as Record<string, any>;
        }
        
        return {
          id: item.id,
          userId: item.user_id,
          userName: userName,
          documentType: item.document_type as DocumentType,
          purpose: item.purpose,
          status: item.status as DocumentStatus,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          attachments: item.attachments || [],
          verifiedBy: item.verified_by,
          verifiedByName: verifiedByName,
          approvedBy: item.approved_by,
          approvedByName: approvedByName,
          rejectionReason: item.rejection_reason,
          additionalNotes: item.additional_notes,
          formDetails: formDetails
        };
      });

      return { data: formattedData, error: null };
    } catch (error) {
      console.error('Error fetching user document requests:', error);
      return { data: null, error: error as PostgrestError };
    }
  }

  static async submitDocumentRequest(
    documentRequest: Omit<DocumentRequest, 'id' | 'createdAt' | 'updatedAt' | 'userName' | 'verifiedByName' | 'approvedByName'>
  ): Promise<{data: DocumentRequest | null, error: PostgrestError | null}> {
    try {
      // For real file uploads, we would first upload the files to storage
      // and get back URLs/file paths, then store those in the database
      
      // Create the document request in the database
      const { data, error } = await supabase
        .from('document_requests')
        .insert({
          id: uuidv4(),
          user_id: documentRequest.userId,
          document_type: documentRequest.documentType,
          purpose: documentRequest.purpose,
          status: 'pending',
          attachments: documentRequest.attachments,
          additional_notes: documentRequest.additionalNotes,
          form_details: documentRequest.formDetails || {}
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Document request submitted successfully");
      
      // Safely access form_details with a fallback
      const formDetails: Record<string, any> = (data.form_details && typeof data.form_details === 'object')
        ? data.form_details as Record<string, any>
        : {};
      
      return { 
        data: {
          id: data.id,
          userId: data.user_id,
          documentType: data.document_type as DocumentType,
          purpose: data.purpose,
          status: data.status as DocumentStatus,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          attachments: data.attachments || [],
          verifiedBy: data.verified_by,
          approvedBy: data.approved_by,
          rejectionReason: data.rejection_reason,
          additionalNotes: data.additional_notes,
          formDetails: formDetails
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error submitting document request:', error);
      toast.error("Failed to submit request. Please try again.");
      return { data: null, error: error as PostgrestError };
    }
  }

  static async updateDocumentStatus(
    documentId: string, 
    status: DocumentStatus, 
    staffId: string, 
    rejectionReason?: string
  ): Promise<{success: boolean, error: PostgrestError | null}> {
    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'verified') {
        updates.verified_by = staffId;
      } else if (status === 'approved') {
        updates.approved_by = staffId;
      } else if (status === 'rejected') {
        updates.rejection_reason = rejectionReason || 'No reason provided';
      }
      
      const { error } = await supabase
        .from('document_requests')
        .update(updates)
        .eq('id', documentId);
      
      if (error) throw error;
      
      toast.success(`Document request ${status} successfully`);
      return { success: true, error: null };
    } catch (error) {
      console.error(`Error updating document status to ${status}:`, error);
      toast.error(`Failed to update document status. Please try again.`);
      return { success: false, error: error as PostgrestError };
    }
  }
}
