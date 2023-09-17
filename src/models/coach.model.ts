import { Field, ObjectType } from '@nestjs/graphql';
import { TeamMemberAbstract } from './team-member-abstract.model';
import { Team } from './team.model';

@ObjectType()
export class Coach extends TeamMemberAbstract {
  @Field(() => Team, { nullable: true })
  team?: Team
}
