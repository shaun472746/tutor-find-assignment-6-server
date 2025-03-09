import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
import config from '../../app/config';

const shurjopay = new Shurjopay();

shurjopay.config(
  config.sp_endpoint!,
  config.sp_username!,
  config.sp_password!,
  config.sp_prefix!,
  config.sp_return_url!
);

// console.log(shurjopay);

const makePaymentAsync = async (
  paymentPayload: any
): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload,
      (response: any) => resolve(response),
      (error: any) => reject(error)
    );
  });

  //   const paymentResult = await shurjopay.makePayment(
  //     paymentPayload,
  //     (response) => {
  //       sendResponse(res, {
  //         statusCode: 200,
  //         message: "Order placed successfully",
  //         data: response,
  //       });
  //     },
  //     (error) => console.log(error)
  //   );
  //   return paymentResult;
};

const verifyPaymentAsync = (
  order_id: string
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (response: any) => resolve(response),
      (error: any) => reject(error)
    );
  });
};

export const studentUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
};
