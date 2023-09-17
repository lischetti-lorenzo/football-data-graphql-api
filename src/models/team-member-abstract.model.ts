import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

@ObjectType({ isAbstract: true })
export class TeamMemberAbstract {
  @Field(() => Int)
  id: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  name: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  dateOfBirth: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  nationality: string;  

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
    createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
    updatedAt: Date;

  @HideField()
    deletedAt: Date | null;
}
