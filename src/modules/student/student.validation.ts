import { z } from 'zod';

const studentValidationSchema = z.object({
  body: z.object({
    id: z.string(),
    address: z
      .string({ required_error: 'Address is required.' })
      .min(5, 'Address must be at least 5 characters long'),
    phone: z
      .string({ required_error: 'Phone number is required.' })
      .regex(/^\d{10,15}$/, 'Phone number must be between 10 to 15 digits'),
    class: z.string({ required_error: 'Address is required.' }),
  }),
});

const bookingPaymentValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'ID is required.' }), // Assuming ID is a string
    hours: z
      .number({ required_error: 'Hours are required.' })
      .min(0, 'Hours must be a positive number'),
    month: z
      .number({ required_error: 'Month is required.' })
      .min(1, 'Month must be at least 1')
      .max(12, 'Month must be at most 12'),
    hourly_rate: z.number({ required_error: 'Month is required.' }),
    userInfo: z.object({
      customer_address: z
        .string({ required_error: 'Customer address is required.' })
        .min(5, 'Address must be at least 5 characters long'),
      customer_city: z.string({ required_error: 'Customer city is required.' }),
      customer_email: z
        .string({ required_error: 'Customer email is required.' })
        .email('Invalid email address'),
      customer_name: z.string({ required_error: 'Customer name is required.' }),
      customer_phone: z
        .string({ required_error: 'Customer phone is required.' })
        .regex(/^\d{10,15}$/, 'Phone number must be between 10 to 15 digits'),
    }),
  }),
});

export const studentValidations = {
  studentValidationSchema,
  bookingPaymentValidationSchema,
};
