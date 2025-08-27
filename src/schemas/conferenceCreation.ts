import moment from 'moment';
import { z } from 'zod';

export const conferenceCategoryValues = [
  'Conference',
  'Book',
  // 'Used for teaching',
  // 'Journal',
  // 'Conference proceedings',
  // 'Processing applications',
] as const;
// Define the conference creation schema
const conferenceSchema = z
  .object({
    conferenceCategory: z.enum(conferenceCategoryValues),
    // conferenceEmail: z.string().email({ message: "Please provide a professional email" }),
    conferenceOrganizerWebPage: z
      .string()
      .url({ message: 'Invalid URL for organizer web page' }).optional(),
    conferenceOrganizerPhoneNumber: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 digits' }),
    conferenceOrganizerRole: z
      .string()
      .min(2, { message: 'Role must be at least 2 characters' }),
    conferenceAnyOtherInformation: z
      .string()
      .max(500, {
        message: 'Any other information must be at most 500 characters',
      })
      .optional(),
    conferenceAcronym: z
      .string()
      .min(2, { message: 'Acronym must be at least 2 characters' }),
    conferenceWebpage: z
      .string()
      .url({ message: 'Invalid URL for conference webpage' }).optional(),
    conferenceVenue: z
      .string()
      .min(2, { message: 'Venue must be at least 2 characters' }).optional(),
    conferenceCity: z
      .string()
      .min(2, { message: 'City must be at least 2 characters' }).optional(),
    conferenceCountry: z
      .string()
      .min(2, { message: 'Country must be at least 2 characters' }).optional(),
    conferenceEstimatedNumberOfSubmissions: z
      .string()
      .transform(value => parseFloat(value))
      .refine(value => !isNaN(value) && value > 0, {
        message: 'Estimated number of submissions must be a positive number',
      }),
    conferenceFirstDay: z.string().transform(date => {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      return formattedDate;
    }),
    conferenceLastDay: z.string().transform(date => {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      return formattedDate;
    }),
    conferenceSubmissionsDeadlineDate: z.string().transform(date => {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      return formattedDate;
    }),
    conferencePrimaryArea: z
      .string()
      .min(2, { message: 'Primary area must be at least 2 characters' }),
    conferenceSecondaryArea: z.string().optional(),
    conferenceAreaNotes: z.string().optional(),
    conferenceTitle: z
      .string()
      .min(2, { message: 'Title must be at least 2 characters' }),
    // conferencePaperSubmissionLink: z.string().url({ message: "Invalid URL for paper submission link" }),
  })
  .refine(
    data => {
      const { conferenceFirstDay, conferenceLastDay } = data;
      return (
        moment(conferenceFirstDay).isBefore(conferenceLastDay) &&
        moment(conferenceFirstDay).isAfter(moment()) &&
        moment(conferenceLastDay).isAfter(moment())
      );
    },
    {
      message:
        'First day must be earlier than the last day and both must be in the future',
      path: ['conferenceFirstDay', 'conferenceLastDay'],
    },
  )
  .refine(
    data => {
      console.log('in the refine');
      const { conferenceSubmissionsDeadlineDate, conferenceLastDay } = data;
      return (
        moment(conferenceSubmissionsDeadlineDate).isAfter(moment()) &&
        moment(conferenceSubmissionsDeadlineDate).isBefore(conferenceLastDay)
      );
    },
    {
      message:
        'Submissions Deadline Date must be in the future and it must be earlier than the last day of conference',
      path: ['conferenceSubmissionsDeadlineDate'],
    },
  )
  .refine(data => data.conferencePrimaryArea !== data.conferenceSecondaryArea, {
    message: 'Primary area must not be the same as secondary area',
    path: ['conferencePrimaryArea', 'conferenceSecondaryArea'],
  });

// Error messages for required fields
const requiredFields = [
  'conferenceTitle',
  'conferenceAcronym',
  // 'conferenceWebpage',
  // 'conferenceVenue',
  // 'conferenceCity',
  // 'conferenceCountry',
  'conferenceFirstDay',
  'conferenceLastDay',
  'conferencePrimaryArea',
  'conferencePaperSubmissionLink',
];

// Function to validate conference data
const validateConferenceData = (data: any) => {
  requiredFields.forEach(field => {
    if (!data[field]) {
      throw new Error(`${field} is required`);
    }
  });

  return conferenceSchema.parse(data);
};

export { conferenceSchema, validateConferenceData };
