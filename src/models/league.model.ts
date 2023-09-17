import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Team } from './team.model';
import { Type } from 'class-transformer';

@ObjectType()
export class League {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  code: string;

  @Field(() => String)
  areaName: string;

  @Field(() => [Team])
  teams: Team[];

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
  updatedAt: Date;

  @HideField()
  deletedAt: Date | null;
}
