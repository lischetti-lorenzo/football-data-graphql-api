import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Player } from '../../models/player.model';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PlayerService {
  private readonly cls = Player;

  constructor (
    private readonly prisma: PrismaService
  ) {};

  async createMany (data: Prisma.PlayerCreateManyInput[]): Promise<void> {
    await this.prisma.player.createMany({
      data
    });
  }

  async findAll (input: Prisma.PlayerFindManyArgs): Promise<Player[]> {
    const { where } = input;
    const players = await this.prisma.player.findMany({
      where: {
        ...where,
        deletedAt: null
      },
      orderBy: [{id: 'asc'}]
    }) ?? [];

    return plainToInstance(this.cls, players);
  }
}
