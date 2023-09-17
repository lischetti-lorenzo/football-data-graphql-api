import { Module, forwardRef } from '@nestjs/common';
import { CoachService } from './coach.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoachResolver } from './coach.resolver';
import { LeagueModule } from '../league/league.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => LeagueModule)
  ],
  providers: [
    CoachService,
    CoachResolver
  ],
  exports: [
    CoachService
  ]
})
export class CoachModule {}
