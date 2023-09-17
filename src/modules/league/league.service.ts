import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FootballDataWrapperService } from '../football-data-wrapper/football-data-wrapper.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TeamService } from '../team/team.service';
import { Team } from '../../models/team.model';
import { Prisma } from '@prisma/client';
import { PlayerService } from '../player/player.service';
import { CoachService } from '../coach/coach.service';
import { League } from '../../models/league.model';
import { plainToInstance } from 'class-transformer';
import { TeamDto } from '../team/dtos/team.dto';

@Injectable()
export class LeagueService {
  private readonly cls = League;

  constructor (
    private readonly prisma: PrismaService,
    private readonly footballDataWrapperService: FootballDataWrapperService,
    private readonly teamService: TeamService,
    private readonly playerService: PlayerService,
    private readonly coachService: CoachService
  ) {}

  async findOne (input: Prisma.LeagueFindFirstArgs): Promise<League> {
    const { where } = input;
    const league = await this.prisma.league.findFirst({
      where: {
        ...where,
        deletedAt: null
      }
    });

    return plainToInstance(this.cls, league);
  }

  async create (input: Prisma.LeagueCreateInput): Promise<League> {
    const league = await this.prisma.league.create({
      data: {
        ...input
      }
    });

    return plainToInstance(this.cls, league);
  }

  async importLeague (code: string): Promise<League> {
    const [league, teamsResponse] = await Promise.all([
      this.footballDataWrapperService.getLeagueByCode(code),
      this.footballDataWrapperService.getTeamsByLeague(code)
    ]);

    if (!league) throw new NotFoundException(`League with code ${code} has not been found`);

    try {      
      const leagueInDb = await this.findOne({
        where: {
          code: league.code,
          areaName: league.area.name          
        }
      });
      
      if (leagueInDb) return;

      const savedLeague = await this.create({
        name: league.name,
        code: league. code,
        areaName: league.area.name
      });

      const teamsInDb = await this.teamService.findAll();
      const teamsMap: Map<number, Team> = new Map();
      teamsInDb.forEach(t => {
        teamsMap.set(t.fDataId, t);
      });

      for (const team of teamsResponse.teams) {        
        const teamInDb = teamsMap.get(team.id);

        if (!teamInDb) {
          await this.createTeam(savedLeague.id, team)
        } else {
          await this.teamService.assignToLeague(savedLeague.id, teamInDb.id);
        }
      }

      return savedLeague;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createTeam (leagueId: number, team: TeamDto): Promise<void> {
    const { id: fDataId, name, tla, shortName, area: { name: areaName }, address } = team;
    const newTeam = await this.teamService.create(leagueId, {
      name,
      tla,
      shortName,
      areaName,
      address,
      fDataId
    });

    if (team.squad.length > 0) {
      const data: Prisma.PlayerCreateManyInput[] = team.squad.map(player => {
        const { name, position, dateOfBirth, nationality } = player;
        return {
          name,
          position,
          dateOfBirth: new Date(dateOfBirth),
          nationality,
          teamId: newTeam.id
        }
      });

      await this.playerService.createMany(data);
    } else {
      const { name, dateOfBirth, nationality } = team.coach;
      await this.coachService.create(newTeam.id, {
        name,
        nationality,
        dateOfBirth: new Date(dateOfBirth)
      });
    }
  }
}
