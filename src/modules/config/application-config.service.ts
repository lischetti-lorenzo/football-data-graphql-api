import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApplicationConfigService {
  constructor (private readonly configService: ConfigService) {}

  get applicationPort (): number {
    return this.configService.get('NODE_PORT') as number;
  }

  get footballDataApiUrl (): string {
    return this.configService.get('FOOTBALL_DATA_API_BASE_URL') as string;
  }

  get origin (): string {
    return 'https://studio.apollographql.com';
  }

  get footballDataToken (): string {
    return this.configService.get('FOOTBALL_DATA_TOKEN') as string;
  }
}
