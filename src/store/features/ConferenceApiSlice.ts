// Need to use the React-specific entry point to import createApi
import { IConference } from '@/model/Conference';
import { conferenceSchema } from '@/schemas/conferenceCreation';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface OrganizedConference {
    _id: string;
    conferenceAcronym: string;
    conferenceOrganizerRole: string;
    conferenceCreatedAt: Date;
}

interface updateType {
  confAcronym: string;
  conferenceDetails: z.infer<typeof conferenceSchema>;
}

// Creating a mapped type that modifies conferenceOrganizer to be a string
type IModifiedConference = Omit<IConference, 'conferenceOrganizer'| 'conferenceStatus' > & {
  conferenceOrganizer: {_id:string,fullname:string};
  conferenceStatus:"outline" | "accepted" | "submitted" | "rejected" | "review" | null | undefined
};



export const ConferenceApiSlice = createApi({
  reducerPath: 'conferenceapi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['conference'],
  endpoints: (builder) => ({
    getOrganizedConferences: builder.query<OrganizedConference[], void>({
      query: () => `/get-conferences`,
      transformResponse: (response: ApiResponse<{ organizedConferences: OrganizedConference[] }>) => {
        if (response.success) {
          return response.data.organizedConferences;
        } else {
          throw new Error(response.message);
        }
      },
      providesTags: ['conference'],
    }),
    createNewConference: builder.mutation<ApiResponse<null>, z.infer<typeof conferenceSchema>>({
      query: (newConference) => ({
        url: '/create-conference',
        method: 'POST',
        body: newConference,
      }),
      invalidatesTags: ['conference'],
    }),
    updateConference: builder.mutation<ApiResponse<null>, updateType>({
      query: ({ confAcronym, conferenceDetails }) => ({
        url: `/edit-conference?confAcronym=${confAcronym}`,
        method: 'PUT',
        body: conferenceDetails,
      }),
      invalidatesTags: ['conference'],
    }),
    getAllAcceptedConferences:builder.query<IConference[], void>({
      query: () => `/get-all-accepted-conferences`,
      transformResponse: (response: ApiResponse<IConference[]>) => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      },
    }),
    getConferenceByConferenceID: builder.query<IModifiedConference, string>({
      query: (confName) => `/get-conference-by-conference-id?confName=${confName}`,
      transformResponse: (response: ApiResponse<IModifiedConference>) => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const { 
  useGetOrganizedConferencesQuery, 
  useCreateNewConferenceMutation, 
  useUpdateConferenceMutation,
  useGetAllAcceptedConferencesQuery,
  useGetConferenceByConferenceIDQuery
} = ConferenceApiSlice;
