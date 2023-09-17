import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { getAxiosError } from './function.utils';

export abstract class AbstractHttpRequest {
  constructor (
    protected readonly httpService: HttpService,
    protected readonly requestConfig: AxiosRequestConfig,
    protected readonly serviceUrl: string
  ) {
  }
  
  protected async getMethod<T> (endpoint: string, mergeConfig?: AxiosRequestConfig): Promise<T> {
    const targetUrl = `${this.serviceUrl}${endpoint}`;
    const config = { ...this.requestConfig, ...mergeConfig };

    const data = await firstValueFrom(
      this.httpService.get(
        targetUrl,
        config
      ).pipe(
        map(resp => resp.data),
        map(data => {
          if (typeof data.error !== 'undefined') throw new Error(data.messages?.join(',') ?? data.error);
          return data;
        }),
        catchError((error: AxiosError) => {
          // Here we handle all the errors got from the external API
          // (including the limit frequency to the requests performed with a free-token to the football data API)
          const message = getAxiosError(error);
          throw new Error(message);
        })
      ));
    return data;
  }

  protected async postMethod<T> (url: string, options: Record<string, any>, mergeConfig?: AxiosRequestConfig): Promise<T> {
    const targetUrl = `${this.serviceUrl}${url}`;
    const config = { ...this.requestConfig, ...mergeConfig };

    const data = await firstValueFrom(
      this.httpService.post(
        targetUrl,
        options,
        config
      ).pipe(
        map(resp => resp.data),
        map(data => {
          if (typeof data.error !== 'undefined') throw new Error(data.messages?.join(',') ?? data.error);
          return data;
        }),
        catchError((error: AxiosError) => {
          throw new Error(error.message);
        })
      ));
    return data;
  }
}
