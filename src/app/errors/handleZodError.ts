import { ZodError } from "zod";
import { TErrorSource, TGenericErrorResponse } from "../../interface/error";

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const error: TErrorSource = err.issues.map((issue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    error,
  };
};