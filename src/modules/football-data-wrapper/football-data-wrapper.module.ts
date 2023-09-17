import { Module } from '@nestjs/common';
import { FootballDataHttpService } from './football-data-http.service';
import { FootballDataWrapperService } from './football-data-wrapper.service';
import { HttpModule } from '@nestjs/axios';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [
    HttpModule,
    AppConfigModule
  ],
  providers: [
    FootballDataWrapperService,
    FootballDataHttpService
  ],
  exports: [
    FootballDataWrapperService
  ]
})
export class FootballDataWrapperModule {}
