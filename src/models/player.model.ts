import { Field, ObjectType } from '@nestjs/graphql';
import { TeamMemberAbstract } from './team-member-abstract.model';
import { IsOptional } from 'class-validator';
import { Team } from './team.model';

@ObjectType()
export class Player extends TeamMemberAbstract {
  @IsOptional()
  @Field(() => String)
  position: string;

  @Field(() => Team, { nullable: true })
  team?: Team
}
