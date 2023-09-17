import { Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

export class AreaDto {
  @IsNotEmpty()
  @IsString()
  name: string
}

export class LeagueDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @Field(() => AreaDto)
  area: AreaDto;
}