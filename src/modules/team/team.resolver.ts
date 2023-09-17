import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Team } from '../../models/team.model';
import { TeamService } from './team.service';
import { Player } from '../../models/player.model';
import { Coach } from '../../models/coach.model';
import { CoachService } from '../coach/coach.service';

@Resolver(() => Team)
export class TeamResolver {
  constructor (
    private readonly teamService: TeamService,
    private readonly coachService: CoachService
  ) {}

  @Query(() => Team, { name: 'team' })
  async getTeam (
    @Args('name') name: string
  ): Promise<Team>  {
    return this.teamService.findOne({
      where: {
        name
      }
    });
  }

  @ResolveField('players', () => [Player])
  async getPlayers (
    @Parent() team: Team
  ): Promise<Player[]> {
    return this.teamService.players(team.id);
  }

  @ResolveField('coach', () => Coach, { nullable: true })
  async getCoach (
    @Parent() team: Team
  ): Promise<Coach> {
    return this.coachService.findOne({
      where: { teamId: team.id }
    });
  }
}
