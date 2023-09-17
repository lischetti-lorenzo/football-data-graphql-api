import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { CoachService } from '../coach/coach.service';
import { FootballDataWrapperService } from '../football-data-wrapper/football-data-wrapper.service';
import { PlayerService } from '../player/player.service';
import { TeamService } from '../team/team.service';
import { LeagueService } from './league.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { League } from '../../models/league.model';
import { LeagueDto } from './dtos/league.dto';
import { TeamResponseDto } from '../team/dtos/team.dto';
import { Team } from '../../models/team.model';

describe('LeagueService', () => {
  let service: LeagueService;
  let mockedPrismaService: DeepMockProxy<PrismaService>;
  let mockedFootballDataWrapperService: DeepMockProxy<FootballDataWrapperService>;
  let mockedTeamService: DeepMockProxy<TeamService>;
  let mockedPlayerService: DeepMockProxy<PlayerService>;
  let mockedCoachService: DeepMockProxy<CoachService>;

  beforeEach(async () => {
    mockedPrismaService = mockDeep<PrismaService>();
    mockedFootballDataWrapperService = mockDeep<FootballDataWrapperService>();
    mockedTeamService = mockDeep<TeamService>();
    mockedPlayerService = mockDeep<PlayerService>();
    mockedCoachService = mockDeep<CoachService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeagueService,
        {
          provide: PrismaService,
          useFactory: () => mockedPrismaService
        },
        {
          provide: FootballDataWrapperService,
          useFactory: () => mockedFootballDataWrapperService
        },
        {
          provide: TeamService,
          useFactory: () => mockedTeamService
        },
        {
          provide: PlayerService,
          useFactory: () => mockedPlayerService
        },
        {
          provide: CoachService,
          useFactory: () => mockedCoachService
        }
      ]
    }).compile();

    service = module.get<LeagueService>(LeagueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('importLeague', () => {
    describe('should import a league successfully', () => {
      let mockCreatedLeague: League;
      let mockTeamsResponse: TeamResponseDto;
      beforeEach(async () => {
        const mockedLeagueFootballData: LeagueDto = {
          name: 'Premier League',
          code: 'PL',
          area: { name: 'England' },
        };
  
        mockTeamsResponse = {
          teams: [
            {
              id: 1,
              name: 'Team A',
              squad: [],
              coach: null,
              tla: 'ta',
              shortName: '',
              address: '',
              area: {
                name: ''
              }
            },
            {
              id: 2,
              name: 'Team B',
              squad: [],
              coach: null,
              tla: 'tb',
              shortName: '',
              address: '',
              area: {
                name: ''
              }
            }
          ]
        };
  
        mockCreatedLeague = {
          name: 'Premier League',
          code: 'PL',
          areaName: 'England',
          id: 1,
          teams: [],
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined
        };
  
        jest.spyOn(mockedFootballDataWrapperService, 'getLeagueByCode').mockResolvedValue(mockedLeagueFootballData);
        jest.spyOn(mockedFootballDataWrapperService, 'getTeamsByLeague').mockResolvedValue(mockTeamsResponse);
        jest.spyOn(service, 'findOne').mockResolvedValue(null);
        jest.spyOn(service, 'createTeam').mockResolvedValue();
        jest.spyOn(service, 'create').mockResolvedValue(mockCreatedLeague);
      });
      it('should create all the teams in the db', async () => {        
        jest.spyOn(mockedTeamService, 'findAll').mockResolvedValue([]);                
  
        const league = await service.importLeague('PL');
  
        expect(service.create).toHaveBeenCalled();
        expect(service.createTeam).toHaveBeenCalledTimes(2);
        expect(mockedTeamService.assignToLeague).not.toHaveBeenCalled();
        expect(league).toMatchObject(mockCreatedLeague);
      });

      it('should create one team and assing to the league the other one', async () => {
        const team: Team = {
          id: 1,
          name: 'Team A',
          players: [],
          coach: null,
          tla: 'ta',
          shortName: '',
          address: '',
          fDataId: 1,
          league: {
            id: 0,
            name: '',
            code: '',
            areaName: '',
            teams: [],
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: undefined
          },
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined
        };

        jest.spyOn(mockedTeamService, 'findAll').mockResolvedValue([team]);                
  
        const league = await service.importLeague('PL');
  
        expect(service.create).toHaveBeenCalled();
        expect(service.createTeam).toHaveBeenCalledTimes(1);
        expect(service.createTeam).toHaveBeenCalledWith(league.id, mockTeamsResponse.teams[1]);
        expect(mockedTeamService.assignToLeague).toHaveBeenCalledTimes(1);
        expect(mockedTeamService.assignToLeague).toHaveBeenCalledWith(league.id, team.id);
        expect(league).toMatchObject(mockCreatedLeague);
      });
    });

    describe('should not import a league', () => {
      beforeEach(async () => {
        const mockTeamsResponse: TeamResponseDto = {
          teams: [
            {
              id: 1,
              name: 'Team A',
              squad: [],
              coach: null,
              tla: 'ta',
              shortName: '',
              address: '',
              area: {
                name: ''
              }
            },
            {
              id: 2,
              name: 'Team B',
              squad: [],
              coach: null,
              tla: 'tb',
              shortName: '',
              address: '',
              area: {
                name: ''
              }
            }
          ]
        };
        
        jest.spyOn(mockedFootballDataWrapperService, 'getTeamsByLeague').mockResolvedValue(mockTeamsResponse);
      });

      it('should throw NotFoundException', async () => {
        jest.spyOn(mockedFootballDataWrapperService, 'getLeagueByCode').mockResolvedValue(null);
        expect(async () => {
          await service.importLeague('PL');
        }).rejects.toThrow('League with code PL has not been found');
      });

      it('when league already exists in the database', async () => {
        const mockedLeagueFootballData: LeagueDto = {
          name: 'Premier League',
          code: 'PL',
          area: { name: 'England' },
        };

        const mockLeagueInDb: League = {
          id: 1,
          name: 'League A',
          code: 'PL',
          areaName: 'England',
          teams: [],
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined
        }

        jest.spyOn(mockedFootballDataWrapperService, 'getLeagueByCode').mockResolvedValue(mockedLeagueFootballData);
        jest.spyOn(service, 'findOne').mockResolvedValue(mockLeagueInDb);

        const league = await service.importLeague('PL');

        expect(service.findOne).toHaveBeenCalledTimes(1);
        expect(service.findOne).toHaveBeenCalledWith({
          where: {
            code: mockedLeagueFootballData.code,
            areaName: mockedLeagueFootballData.area.name          
          }
        });
        expect(league).not.toBeDefined();
      });
    });
  });
});
