import { AxiosError } from 'axios';

export function getAxiosError (error: AxiosError<any>): string {
  const responseErrorMessage = error?.response?.data.detail ?? error?.response?.data.message;
  let message: string = responseErrorMessage ?? error.message;
  const errors = error.response?.data?.messages?.length ?? 0;
  if (errors > 0) {
    message += ' > Messages: ';
    message += error?.response?.data.messages.join(',') as string;
  }
  return message;
}