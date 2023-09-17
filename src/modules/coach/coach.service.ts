import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Coach } from '../../models/coach.model';
import { PrismaService } from '../../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CoachService {
  private readonly cls = Coach;

  constructor (
    private readonly prisma: PrismaService
  ) {};

  async create (teamId: number, input: Prisma.CoachCreateInput): Promise<Coach> {
    const coach = await this.prisma.coach.create({
      data: {
        ...input,
        team: {
          connect: { id: teamId }
        },
        createdAt: new Date()
      }
    });

    return plainToInstance(this.cls, coach);
  }

  async findAll (input: Prisma.CoachFindManyArgs): Promise<Coach[]> {
    const coaches =  await this.prisma.coach.findMany({
      where: {
        ...input.where,
        deletedAt: null
      }
    }) ?? [];

    return plainToInstance(this.cls, coaches);
  }

  async findOne (input: Prisma.CoachFindFirstArgs): Promise<Coach> {
    const coach =  await this.prisma.coach.findFirst({
      where: {
        ...input.where,
        deletedAt: null
      }
    }) ?? null;

    return plainToInstance(this.cls, coach);
  }
}
