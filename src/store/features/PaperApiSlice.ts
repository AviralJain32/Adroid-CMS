import { IConference } from '@/model/Conference';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { SubmittedPaper as paperType } from '@/types/SubmittedPaperType';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface SubmittedPaper {
  paperAuthor: [];
  correspondingAuthor: [];
  paperTitle: string;
  paperFile: string;
  paperKeywords: string[];
  paperAbstract: string;
  paperSubmissionDate: Date;
  conference: { conferenceAcronym: string };
  paperStatus: 'submitted' | 'accepted' | 'rejected' | 'review';
  paperID: string;
}

export const PaperApiSlice = createApi({
  reducerPath: 'paperapi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  tagTypes: ['paper'],
  endpoints: builder => ({
    getSubmittedPapers: builder.query<SubmittedPaper[], void>({
      query: () => `/users/me/papers`,
      transformResponse: (
        response: ApiResponse<{ submittedPapers: SubmittedPaper[] }>,
      ) => {
        if (response.success) {
          return response.data.submittedPapers;
        } else {
          throw new Error(response.message);
        }
      },
    }),
    getConferencePapers: builder.query<
      {
        paperSubmittedInConference: SubmittedPaper[];
        getConferenceDetails: IConference;
      },
      string
    >({
      query: confName => `/conferences/${confName}/papers`,
      transformResponse: (
        response: ApiResponse<{
          paperSubmittedInConference: SubmittedPaper[];
          getConferenceDetails: IConference;
        }>,
      ) => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      },
      providesTags: ['paper'],
    }),
    deleteConferencePaper: builder.mutation<
      ApiResponse<null>,
      { paperIdList: string[] }
    >({
      query: ({ paperIdList }) => ({
        url: `/delete-papers`,
        method: 'DELETE',
        body: { paperIdList },
      }),
      invalidatesTags: ['paper'],
      transformResponse: (response: ApiResponse<null>) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response;
      },
    }),
  }),
});

export const {
  useGetSubmittedPapersQuery,
  useGetConferencePapersQuery,
  useDeleteConferencePaperMutation,
} = PaperApiSlice;
