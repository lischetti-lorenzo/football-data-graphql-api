import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './modules/config/config.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { LeagueModule } from './modules/league/league.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { FootballDataWrapperModule } from './modules/football-data-wrapper/football-data-wrapper.module';
import { TeamModule } from './modules/team/team.module';
import { PlayerModule } from './modules/player/player.module';
import { CoachModule } from './modules/coach/coach.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/graphql',
      autoSchemaFile: join(process.cwd(), '../modules/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': true
      }
    }),    
    AppConfigModule,
    FootballDataWrapperModule,
    LeagueModule,
    TeamModule,
    PlayerModule,
    CoachModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService    
  ],
})
export class AppModule {}
