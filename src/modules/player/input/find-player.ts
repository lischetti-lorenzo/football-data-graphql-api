import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class FindPlayerArgs {
  @Field(() => String)
  leagueCode: string;
  
  @Field(() => String, { nullable: true })
  @IsOptional()
  teamName?: string;
}
