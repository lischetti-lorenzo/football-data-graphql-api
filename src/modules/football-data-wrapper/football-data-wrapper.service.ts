import { Injectable } from '@nestjs/common';
import { LeagueDto } from '../league/dtos/league.dto';
import { FootballDataHttpService } from './football-data-http.service';
import { TeamResponseDto } from '../team/dtos/team.dto';

enum FootballDataEndpoints {
  LEAGUES = 'competitions',
  TEAMS = 'teams'
}

@Injectable()
export class FootballDataWrapperService {
  constructor (
    private readonly footballDataHttpService: FootballDataHttpService
  ) {}

  async getLeagueByCode (code: string): Promise<LeagueDto> {
    return this.footballDataHttpService.get<LeagueDto>(`${FootballDataEndpoints.LEAGUES}/${code}`);
  }

  async getTeamsByLeague (leagueCode: string): Promise<TeamResponseDto> {
    return this.footballDataHttpService.get<TeamResponseDto>(`${FootballDataEndpoints.LEAGUES}/${leagueCode}/${FootballDataEndpoints.TEAMS}`);
  }
}
