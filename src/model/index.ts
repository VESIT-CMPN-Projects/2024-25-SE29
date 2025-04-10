
export type UserRole = 'citizen' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved' | 'rejected' | 'verified';

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  createdAt: Date;
  updatedAt: Date;
  location?: string;
  category: string;
  assignedTo?: string;
  attachments?: string[];
  comments?: Comment[];
  userName?: string;
  assignedToName?: string;
}

export interface Comment {
  id: string;
  complaintId: string;
  userId: string;
  text: string;
  createdAt: Date;
  isStaff: boolean;
}

export type DocumentType = 'birth' | 'death' | 'marriage' | 'income' | 'residence' | 'other';
export type DocumentStatus = 'pending' | 'verified' | 'approved' | 'rejected';

export interface DocumentRequest {
  id: string;
  userId: string;
  userName?: string;
  documentType: DocumentType;
  purpose: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
  attachments: string[];
  verifiedBy?: string;
  verifiedByName?: string;
  approvedBy?: string;
  approvedByName?: string;
  rejectionReason?: string;
  additionalNotes?: string;
  formDetails?: Record<string, any>;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
  category: string;
  important: boolean;
}

export interface StaffPerformance {
  staffId: string;
  staffName: string;
  complaintsResolved: number;
  documentsReviewed: number;
  documentsApproved: number;
  lastActive: Date;
}

export type ProfileJoinError = {
  error: true;
} & string;
