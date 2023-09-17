import { Args, Query, Resolver } from '@nestjs/graphql';
import { Player } from '../../models/player.model';
import { PlayerService } from './player.service';
import { FindPlayerArgs } from './input/find-player';
import { CoachService } from '../coach/coach.service';
import { LeagueService } from '../league/league.service';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => Player)
export class PlayerResolver {
  constructor (
    private readonly playerService: PlayerService,
    private readonly coachService: CoachService,
    private readonly leagueService: LeagueService
  ) {}

  @Query(() => [Player], { name: 'playersByLeague' })
  async getPlayersByLeague (
    @Args() findPlayerArgs: FindPlayerArgs
  ): Promise<Player[]> {
    const league = await this.leagueService.findOne({
      where: {
        code: findPlayerArgs.leagueCode
      }
    });

    if (!league) throw new BadRequestException(`League with code ${findPlayerArgs.leagueCode} doesn't existe in the database`);

    return await this.playerService.findAll({
      where: {
        team: {
          name: findPlayerArgs.teamName,
          leagues: {
            some: {
              league: {
                code: findPlayerArgs.leagueCode
              }
            }
          }
        }
      }
    });
  }
}
