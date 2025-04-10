
import React, { useState, useEffect } from 'react';
import { StaffController } from '@/controllers/StaffController';
import { StaffPerformance } from '@/model';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserCheck, FileCheck, ClipboardCheck } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const StaffPerformanceDashboard = () => {
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch staff performance data
  const fetchStaffPerformance = async () => {
    setLoading(true);
    try {
      const { data, error } = await StaffController.getStaffPerformance();
      
      if (error) throw error;
      
      setStaffPerformance(data || []);
    } catch (error) {
      console.error('Error fetching staff performance:', error);
      toast.error('Failed to load staff performance data');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchStaffPerformance();
  }, []);
  
  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('staff-performance-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'complaints' }, 
        () => {
          fetchStaffPerformance();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'document_requests' }, 
        () => {
          fetchStaffPerformance();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-heading text-gov-blue-800">Staff Performance Dashboard</CardTitle>
        <CardDescription>Monitor staff activity and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loading text="Loading staff performance data..." />
        ) : staffPerformance.length === 0 ? (
          <div className="text-center py-8">
            <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No staff performance data available</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no active staff members or no recorded activities yet
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead className="text-center">Complaints Resolved</TableHead>
                <TableHead className="text-center">Documents Verified</TableHead>
                <TableHead className="text-center">Documents Approved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffPerformance.map((staff) => (
                <TableRow key={staff.staffId}>
                  <TableCell className="font-medium">{staff.staffName}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                      {staff.complaintsResolved}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      <FileCheck className="mr-2 h-4 w-4 text-blue-500" />
                      {staff.documentsReviewed}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      <ClipboardCheck className="mr-2 h-4 w-4 text-purple-500" />
                      {staff.documentsApproved}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffPerformanceDashboard;
