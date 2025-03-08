import { z } from 'zod';

const createBookingRequestValidationSchema = z.object({
  body: z.object({
    availability_slot: z.string({
      invalid_type_error: 'Availability slot must be string',
      required_error: 'Availability slot is required',
    }),
    class: z.string({
      required_error: 'class is required',
    }),
    hourly_rate: z.number({
      required_error: 'Hourly Rate is required',
    }),
    subjects: z.string({
      invalid_type_error: 'Subjects must be string',
      required_error: 'Subjects is required',
    }),
    userId: z.string({
      invalid_type_error: 'userId must be string',
      required_error: 'userId is required',
    }),
    tutorId: z.string({
      invalid_type_error: 'tutorId must be string',
      required_error: 'tutorId is required',
    }),
  }),
});
const createAcceptBookingRequestValidationSchema = z.object({
  body: z.object({
    time_slot: z.string({
      invalid_type_error: 'Time slot must be string',
      required_error: 'Time slot is required',
    }),
    class: z.string({
      required_error: 'class is required',
    }),
    hourly_rate: z.number({
      required_error: 'Hourly Rate is required',
    }),
    subject: z.string({
      invalid_type_error: 'Subject must be string',
      required_error: 'Subject is required',
    }),
    student: z.string({
      invalid_type_error: 'StudentId must be string',
      required_error: 'StudentId is required',
    }),
    tutor: z.string({
      invalid_type_error: 'TutorId must be string',
      required_error: 'TutorId is required',
    }),
    id: z.string({
      invalid_type_error: 'id must be string',
      required_error: 'id is required',
    }),
  }),
});

export const bookingRequestValidations = {
  createBookingRequestValidationSchema,
  createAcceptBookingRequestValidationSchema,
};
