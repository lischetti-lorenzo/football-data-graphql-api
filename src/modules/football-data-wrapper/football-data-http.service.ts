import { Injectable } from '@nestjs/common';
import { AbstractHttpRequest } from '../../shared/abstract.http.request';
import { HttpService } from '@nestjs/axios';
import { ApplicationConfigService } from '../config/application-config.service';

@Injectable()
export class FootballDataHttpService extends AbstractHttpRequest {
  constructor (
    protected readonly httpService: HttpService,
    protected readonly applicationConfigService: ApplicationConfigService
  ) {
    super(httpService, {
      headers: {
        'X-Auth-Token': applicationConfigService.footballDataToken
      }
    }, applicationConfigService.footballDataApiUrl);
  }

  async get<T> (endpoint: string): Promise<T> {
    return await super.getMethod(endpoint);
  }
}
