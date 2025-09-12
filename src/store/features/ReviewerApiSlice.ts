import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewerApiSlice = createApi({
  reducerPath: 'reviewerApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['ReviewerStatus', 'ReviewRequests'], // 👈 tags for caching
  endpoints: (builder) => ({
    // Fetch reviewer status
    getReviewerStatus: builder.query<{ isReviewer: boolean }, void>({
      query: () => '/get-reviewer-status',
      providesTags: ['ReviewerStatus'],
    }),

    // Update reviewer status
    updateReviewerStatus: builder.mutation<{ success: boolean }, { isReviewer: boolean }>({
      query: ({ isReviewer }) => ({
        url: '/update-reviewer-status',
        method: 'POST',
        body: { isReviewer },
      }),
      invalidatesTags: ['ReviewerStatus'], // refresh cache after update
    }),

    // Fetch review requests
    getReviewRequests: builder.query<{ requests: any[] }, void>({
      query: () => '/get-review-requests',
      providesTags: ['ReviewRequests'],
    }),

    // Accept / reject request
    reviewAction: builder.mutation<{ success: boolean; message?: string }, { reviewerId: string; action: string; paperId: string }>({
      query: ({ reviewerId, action, paperId }) => ({
        url: `/review-requests-action?action=${action}&paperId=${paperId}&reviewerId=${reviewerId}`,
        method: 'POST',
      }),
      invalidatesTags: ['ReviewRequests'], // refresh after action
    }),
  }),
});

export const {
  useGetReviewerStatusQuery,
  useUpdateReviewerStatusMutation,
  useGetReviewRequestsQuery,
  useReviewActionMutation,
} = reviewerApiSlice;
