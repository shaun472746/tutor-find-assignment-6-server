import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Name must be string',
      required_error: 'Name is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    role: z.enum(['tutor', 'student']),
    password: z
      .string({
        invalid_type_error: 'Password must be string',
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters long'),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required.' })
      .email('Invalid email format'),
    password: z.string({
      invalid_type_error: 'Password must be string',
      required_error: 'Password is required',
    }),
  }),
});

const updatePasswordValidationSchema = z.object({
  body: z.object({
    newPassword: z
      .string({ required_error: 'New password is required.' })
      .min(8, 'Password must be at least 8 characters long'),
    oldPassword: z
      .string({
        required_error: 'Old password is required',
      })
      .min(8, 'Password must be at least 8 characters long'),
  }),
});

const uploadProfileImageValidationSchema = z.object({
  body: z.object({
    url: z.string({ required_error: 'Image url is required.' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

/**
 * update tutor profile
 */
const tutorValidationSchema = z.object({
  body: z.object({
    id: z.string(),
    expertise: z
      .array(z.string(), { required_error: 'Expertises are required.' })
      .nonempty('At least one subject is required.'),
    subjects: z
      .array(z.string(), { required_error: 'Subjects are required.' })
      .nonempty('At least one subject is required.'),
    rating: z
      .number()
      .min(0, 'Rating must be at least 0.')
      .max(5, 'Rating cannot exceed 5.')
      .optional(),
    image: z.string().optional(),
    address: z.string({ required_error: 'Address is required.' }),
    phone: z
      .string({ required_error: 'Phone number is required.' })
      .min(10, 'Phone number must be at least 10 characters.'),
    earning: z.number().min(0, 'Earning cannot be negative.').optional(),
    availability_slot: z
      .array(z.string(), {
        required_error: 'Availability slot is required.',
      })
      .nonempty('At least one availability slot is required.'),
    hourly_rate: z
      .number({ required_error: 'Hourly rate is required.' })
      .min(0, 'Hourly rate cannot be negative.'),
  }),
});
export const userValidations = {
  createUserValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  updatePasswordValidationSchema,
  tutorValidationSchema,
  uploadProfileImageValidationSchema,
};
