import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsPositive,
  IsString,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsPositive()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  DEFAULT_LANG: string;

  // Databases
  @IsNotEmpty()
  @IsString()
  MONGO_URI_ECOMMERCE: string;

  @IsNotEmpty()
  @IsIn(['false', 'true'])
  MONGO_DEBUG: string;

  @IsNotEmpty()
  @IsIn(['false', 'true'])
  MONGO_DEBUG_INDENT: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
