import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { ApplicationConfigService } from './application-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validate
    })
  ],
  providers: [
    ApplicationConfigService
  ],
  exports: [
    ApplicationConfigService
  ]
})
export class AppConfigModule {}
