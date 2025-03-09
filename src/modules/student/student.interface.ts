import { Types } from 'mongoose';

export interface TStudentProfile {
  id?: Types.ObjectId;
  address: string;
  phone: string;
  class: string;
}

export type TBookingPayment = {
  bookingRequestId: Types.ObjectId;
  hours: number;
  month: number;
  userInfo: TuserInfo;
  hourly_rate: number;
  tutorId?: string;
  transaction?: {
    id?: string;
    transactionStatus?: string;
    bank_status?: string;
    sp_code?: string;
    sp_message?: string;
    method?: string;
    date_time?: string;
  };
};

type TuserInfo = {
  customer_address: string;
  customer_city: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
};
