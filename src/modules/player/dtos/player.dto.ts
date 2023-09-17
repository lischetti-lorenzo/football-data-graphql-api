import { IsNotEmpty, IsString } from 'class-validator';
import { TeamMemberDto } from '../../team/dtos/team.dto';

export class PlayerDto extends TeamMemberDto {
  @IsNotEmpty()
  @IsString()
  position: string  | null;
}
