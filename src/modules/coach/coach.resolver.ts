import { Args, Query, Resolver } from '@nestjs/graphql';
import { Coach } from '../../models/coach.model';
import { CoachService } from './coach.service';
import { BadRequestException } from '@nestjs/common';
import { FindCoachesArgs } from './input/find-coaches';
import { LeagueService } from '../league/league.service';

@Resolver(() => Coach)
export class CoachResolver {
  constructor (
    private readonly coachService: CoachService,
    private readonly leagueService: LeagueService
  ) {}

  @Query(() => [Coach], { name: 'coachesByLeague' })
  async getCoachesByLeague (
    @Args() findCoachesArgs: FindCoachesArgs
  ): Promise<Coach[]> {
    const league = await this.leagueService.findOne({
      where: {
        code: findCoachesArgs.leagueCode
      }
    });

    if (!league) throw new BadRequestException(`League with code ${findCoachesArgs.leagueCode} doesn't existe in the database`);

    return await this.coachService.findAll({
      where: {
        team: {
          name: findCoachesArgs.teamName,
          leagues: {
            some: {
              league: {
                code: findCoachesArgs.leagueCode
              }
            }
          }
        }
      }
    });
  }
}
