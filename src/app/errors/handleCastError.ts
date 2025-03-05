import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../../interface/error";

export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const error: TErrorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 403;
  return {
    statusCode,
    message: "Validation Error",
    error,
  };
};