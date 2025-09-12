'use client';

import { PulseLoader } from 'react-spinners';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import ReviewRequestTable from './RequestsReviewPaper';
import AcceptedPapersTable from './AcceptedReviewPaper';
import RejectedReviewRequestTable from './RejectedReviewPaper';

import {
  useGetReviewerStatusQuery,
  useUpdateReviewerStatusMutation,
  useGetReviewRequestsQuery,
  useReviewActionMutation } from '@/store/features/ReviewerApiSlice';

const ReviewedPapersComponent = () => {
  const { data: reviewerStatus, isLoading: statusLoading } = useGetReviewerStatusQuery();
  const [updateReviewerStatus] = useUpdateReviewerStatusMutation();
  const { data: reviewRequests, isLoading: requestsLoading } = useGetReviewRequestsQuery(undefined, {
    skip: !reviewerStatus?.isReviewer, // 👈 only fetch if reviewer enabled
  });
  const [reviewAction] = useReviewActionMutation();

  const handleSwitchChange = async (value: boolean) => {
    try {
      await updateReviewerStatus({ isReviewer: value }).unwrap();
      toast({
        title: 'Success',
        description: `Reviewer status updated to ${value ? 'Enabled' : 'Disabled'}.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update reviewer status.',
        variant: 'destructive',
      });
    }
  };

  const handleAction = async (reviewerId: string, action: 'accept' | 'reject', paperId: string) => {
    try {
      const res = await reviewAction({ reviewerId, action, paperId }).unwrap();
      toast({
        title: res.success ? 'Success' : 'Notice',
        description: res.message || `Request ${action}ed successfully.`,
        variant: res.success ? 'default' : 'destructive',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.data?.message || 'Unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 rounded-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="reviewer-status" className="text-lg font-semibold">
            Reviewer Status
          </Label>
          <Switch
            id="reviewer-status"
            checked={reviewerStatus?.isReviewer ?? false}
            onCheckedChange={handleSwitchChange}
          />
        </div>
        <p className="text-gray-600 mt-1">
          {reviewerStatus?.isReviewer
            ? 'You are currently a reviewer. Toggle off to disable.'
            : 'You are not a reviewer. Toggle on to enable.'}
        </p>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-4 flex justify-center space-x-4">
          <TabsTrigger value="requests" className="flex-1 text-center">Incoming Requests</TabsTrigger>
          <TabsTrigger value="accepted" className="flex-1 text-center">Accepted</TabsTrigger>
          <TabsTrigger value="rejected" className="flex-1 text-center">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="rounded-lg p-4 bg-white shadow-md">
          {requestsLoading ? (
            <div className="flex justify-center items-center py-4">
              <PulseLoader size={10} color="#4A90E2" />
            </div>
          ) : reviewRequests?.requests?.length === 0 ? (
            <p className="text-center text-gray-500">No pending review requests.</p>
          ) : (
            <ReviewRequestTable requests={reviewRequests?.requests || []} handleAction={handleAction} />
          )}
        </TabsContent>

        <TabsContent value="accepted" className="rounded-lg p-4 bg-white shadow-md">
          <AcceptedPapersTable />
        </TabsContent>

        <TabsContent value="rejected" className="rounded-lg p-4 bg-white shadow-md">
          <RejectedReviewRequestTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewedPapersComponent;
