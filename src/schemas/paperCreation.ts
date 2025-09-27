import { z } from 'zod';

const paperSubmissionSchema = z.object({
  paperTitle: z.string().min(1, 'Paper title is required'),
  paperKeywords: z
    .string()
    .min(2, { message: 'The paper keyword length should be greater than 2' }),
  paperAbstract: z.string().min(1, 'Paper abstract is required'),
  paperFile: z
    .any()
    .refine(file => file instanceof FileList && file.length === 1, {
      message: 'File is required and should be exactly one file',
    }),
  paperAuthors: z.array(
    z.object({
      // FirstName: z.string().min(3, "First name should be at least 3 characters"),
      // LastName: z.string().min(3, "Last name should be at least 3 characters"),
      email: z.string().email('Invalid email address'),
      name: z.string().min(3, "Name should be minimum of 3 letters"),
      country: z.string().min(1, "Country is required"),
      affiliation: z.string().min(3, "Affiliation should be at least 3 characters"),
      
      // WebPage: z.string().url("Invalid URL").optional(),
      isCorrespondingAuthor: z.coerce.boolean().default(false),
    }),
  ),
});

export { paperSubmissionSchema };
