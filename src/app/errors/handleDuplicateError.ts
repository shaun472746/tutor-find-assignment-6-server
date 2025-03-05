import { TErrorSource, TGenericErrorResponse } from "../../interface/error";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const error: TErrorSource = [
    {
      path: "",
      message: `${extractedMessage} already exists`,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    error,
  };
};