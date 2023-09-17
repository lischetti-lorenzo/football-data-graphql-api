import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { TeamResolver } from './team.resolver';
import { CoachModule } from '../coach/coach.module';

@Module({
  imports: [
    PrismaModule,
    CoachModule
  ],
  providers: [
    TeamService,
    TeamResolver
  ],
  exports: [
    TeamService
  ]
})
export class TeamModule {}
