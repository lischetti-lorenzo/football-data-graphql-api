import { IsNotEmpty, IsNumber, IsString,  } from 'class-validator';
import { AreaDto } from '../../league/dtos/league.dto';
import { PlayerDto } from '../../player/dtos/player.dto';
import { CoachDto } from '../../coach/dtos/coach.dto';

export class TeamMemberDto {
  @IsNotEmpty()
  @IsString()
  name: string | null;

  @IsNotEmpty()
  @IsString()
  dateOfBirth: string | null;

  @IsNotEmpty()
  @IsString()
  nationality: string | null;
}

export class TeamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  tla: string;

  @IsNotEmpty()
  @IsString()
  shortName: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  area: AreaDto;

  @IsNotEmpty()
  coach: CoachDto;

  squad: PlayerDto[];
}

export class TeamResponseDto {
  @IsNotEmpty()
  teams: TeamDto[];  
}
