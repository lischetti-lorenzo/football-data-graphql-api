import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Coach } from './coach.model';
import { Player } from './player.model';
import { League } from './league.model';
import { Type } from 'class-transformer';

@ObjectType()
export class Team {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  tla?: string | null;

  @Field(() => String, { nullable: true })
  shortName?: string | null;

  @Field(() => String, { nullable: true })
  areaName?: string | null;

  @Field(() => String, { nullable: true })
  address?: string | null;

  @Field(() => Int)
  fDataId: number

  @Field(() => Coach, { nullable: true })
  coach?: Coach;

  @Field(() => [Player])
  players: Player[];

  @Field(() => League)
  league: League;

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
    createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
    updatedAt: Date;

  @HideField()
    deletedAt: Date | null;
}
