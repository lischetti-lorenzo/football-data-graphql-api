import { Module, forwardRef } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PlayerResolver } from './player.resolver';
import { CoachModule } from '../coach/coach.module';
import { LeagueModule } from '../league/league.module';

@Module({
  imports: [
    PrismaModule,
    CoachModule,
    forwardRef(() => LeagueModule)    
  ],
  providers: [
    PlayerService,
    PlayerResolver
  ],
  exports: [
    PlayerService
  ]
})
export class PlayerModule {}
