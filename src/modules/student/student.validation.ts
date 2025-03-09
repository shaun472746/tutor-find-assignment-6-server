import { z } from 'zod';

const userInfoSchema = z.object({
  customer_address: z.string(),
  customer_city: z.string(),
  customer_email: z.string().email(),
  customer_name: z.string(),
  customer_phone: z.string(),
});

// Define the schema for the transaction object
const transactionSchema = z.object({
  id: z.string().optional(),
  transactionStatus: z.string().optional(),
  bank_status: z.string().optional(),
  sp_code: z.string().optional(),
  sp_message: z.string().optional(),
  method: z.string().optional(),
  date_time: z.string().optional(),
});

// Define the schema for TBookingPayment
const bookingPaymentValidationSchema = z.object({
  body: z.object({
    bookingRequestId: z.string(),
    hours: z.number().positive(),
    month: z.number().min(1).max(12),
    userInfo: userInfoSchema,
    hourly_rate: z.number().positive(),
    _id: z.string().optional(),
    transaction: transactionSchema.optional(),
  }),
});

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

export const studentValidations = {
  studentValidationSchema,
  bookingPaymentValidationSchema,
};
