export type TErrorSource = {
    path: string | number;
    message: string;
  }[];
  
  export type TGenericErrorResponse = {
    message: string;
    statusCode: number;
    error: TErrorSource;
  };