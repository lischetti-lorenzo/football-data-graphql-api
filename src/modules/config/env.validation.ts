import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  @IsNotEmpty()
  NODE_PORT: number;

  @IsString()
  @IsNotEmpty()
  POSTGRES_DB: string;

  @IsNumber()
  @IsNotEmpty()
  POSTGRES_PORT: number;

  @IsString()
  @IsNotEmpty()
  POSTGRES_USER: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_PASSWORD: string;  

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  FOOTBALL_DATA_API_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  FOOTBALL_DATA_TOKEN: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false
  });

  if (errors.length > 0) {
    console.log('Found environment variable issues: ', errors.length);
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
