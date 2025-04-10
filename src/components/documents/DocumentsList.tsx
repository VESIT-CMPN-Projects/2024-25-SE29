
import React, { useState, useEffect } from 'react';
import { DocumentRequest } from '@/model';
import { DocumentController } from '@/controllers/DocumentController';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, Filter, Search, Clock, CheckCircle, 
  AlertTriangle, XCircle, Eye, Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface DocumentsListProps {
  userId?: string; // If provided, only show documents for this user
  isStaff?: boolean;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({ userId, isStaff = false }) => {
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const [selectedDocument, setSelectedDocument] = useState<DocumentRequest | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingStatus, setProcessingStatus] = useState(false);

  // Fetch documents
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = userId 
        ? await DocumentController.getUserDocumentRequests(userId)
        : await DocumentController.getDocumentRequests();
        
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load document requests');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('document-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'document_requests' }, 
        (payload) => {
          console.log('Document change received:', payload);
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Handle document status update
  const handleStatusUpdate = async (document: DocumentRequest, status: 'verified' | 'approved' | 'rejected') => {
    if (status === 'rejected') {
      setSelectedDocument(document);
      setShowDialog(true);
      return;
    }
    
    setProcessingStatus(true);
    try {
      const staffId = userId;
      if (!staffId) {
        toast.error('Staff ID not found');
        return;
      }
      
      const { success, error } = await DocumentController.updateDocumentStatus(
        document.id,
        status,
        staffId
      );
      
      if (error) throw error;
      if (!success) {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating document status:', error);
      toast.error('Failed to update document status');
    } finally {
      setProcessingStatus(false);
    }
  };

  // Handle rejection submission
  const handleRejectSubmit = async () => {
    if (!selectedDocument || !userId) {
      toast.error('Missing document or staff information');
      return;
    }
    
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    setProcessingStatus(true);
    try {
      const { success, error } = await DocumentController.updateDocumentStatus(
        selectedDocument.id,
        'rejected',
        userId,
        rejectionReason
      );
      
      if (error) throw error;
      
      if (success) {
        setShowDialog(false);
        setRejectionReason('');
        setSelectedDocument(null);
      } else {
        toast.error('Failed to reject the document');
      }
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error('Failed to reject document');
    } finally {
      setProcessingStatus(false);
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Verified</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.userName && doc.userName.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.documentType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get document type display name
  const getDocumentTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1) + ' Certificate';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-heading text-gov-blue-800 flex items-center">
          <FileText className="mr-2 h-6 w-6" />
          Document Requests
        </CardTitle>
        <CardDescription>
          {isStaff 
            ? 'View and manage document requests from citizens' 
            : 'Track your document certificate requests'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row mb-6 gap-4">
          <div className="md:w-1/2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search document requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="md:w-1/4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="md:w-1/4">
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Select 
                value={typeFilter} 
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="birth">Birth Certificate</SelectItem>
                  <SelectItem value="death">Death Certificate</SelectItem>
                  <SelectItem value="marriage">Marriage Certificate</SelectItem>
                  <SelectItem value="income">Income Certificate</SelectItem>
                  <SelectItem value="residence">Residence Certificate</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <Loading text="Loading document requests..." />
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No document requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'You have not made any document requests yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  {isStaff && <TableHead>Citizen</TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  {isStaff && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="group hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{getDocumentTypeDisplay(doc.documentType)}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{doc.purpose}</div>
                      </div>
                    </TableCell>
                    {isStaff && (
                      <TableCell>
                        <div className="text-sm">{doc.userName || 'Unknown'}</div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm">{format(doc.createdAt, 'dd/MM/yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    {isStaff && (
                      <TableCell>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={doc.status !== 'pending' || processingStatus}
                            onClick={() => handleStatusUpdate(doc, 'verified')}
                            title="Verify"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={doc.status !== 'verified' || processingStatus}
                            onClick={() => handleStatusUpdate(doc, 'approved')}
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={(doc.status !== 'pending' && doc.status !== 'verified') || processingStatus}
                            onClick={() => handleStatusUpdate(doc, 'rejected')}
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Rejection Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Document Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this document request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Enter reason for rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={processingStatus}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim() || processingStatus}
              >
                {processingStatus ? <Loading size="sm" /> : 'Reject Document'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DocumentsList;
