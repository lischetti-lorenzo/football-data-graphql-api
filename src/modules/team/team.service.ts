import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Team } from '../../models/team.model';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { Player } from '../../models/player.model';

@Injectable()
export class TeamService {
  private readonly cls = Team;

  constructor (
    private readonly prisma: PrismaService
  ) {}

  async findAll (): Promise<Team[]> {
    const teams = await this.prisma.team.findMany();
    return plainToInstance(this.cls, teams);
  }

  async findOne (input: Prisma.TeamFindFirstArgs): Promise<Team> {
    const team = await this.prisma.team.findFirst({
      where: {
        ...input.where,
        deletedAt: null
      }
    }) ?? null;

    return plainToInstance(this.cls, team);
  }

  async create (leagueId: number, input: Prisma.TeamCreateInput): Promise<Team> {
    const team = await this.prisma.team.create({
      data: {
        ...input,
        createdAt: new Date(),
        leagues: {
          create: {
            createdAt: new Date(),
            league: {
              connect: { id: leagueId }
            }
          }
        }
      }
    });

    return plainToInstance(this.cls, team);
  }

  async assignToLeague (leagueId: number, teamId: number): Promise<void> {
    await this.prisma.leagueTeam.create({
      data: {
        leagueId,
        teamId,
        createdAt: new Date()
      }
    });
  }

  async players (teamId: number): Promise<Player[]> {
    const players = await this.prisma.team.findUnique({
      where: { id: teamId }
    }).players() ?? [];

    return plainToInstance(Player, players);
  }
}
