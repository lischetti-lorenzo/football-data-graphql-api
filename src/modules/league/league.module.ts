import { Module, forwardRef } from '@nestjs/common';
import { LeagueResolver } from './league.resolver';
import { LeagueService } from './league.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { FootballDataWrapperModule } from '../football-data-wrapper/football-data-wrapper.module';
import { TeamModule } from '../team/team.module';
import { PlayerModule } from '../player/player.module';
import { CoachModule } from '../coach/coach.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    PrismaModule,
    FootballDataWrapperModule,
    forwardRef(() => TeamModule),
    forwardRef(() => PlayerModule),
    forwardRef(() => CoachModule)
  ],
  providers: [
    LeagueResolver,
    LeagueService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub()
    }
  ],
  exports: [
    LeagueService
  ]
})
export class LeagueModule {}
