import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsAlpha('fa-IR')
  firstName: string;

  @ApiProperty()
  @IsAlpha('fa-IR')
  lastName: string;

  @ApiProperty({ description: 'National ID should be provided as username' })
  @IsNumberString({ locale: 'en-US' })
  username: string;

  @ApiProperty({ maxLength: 32, minLength: 8 })
  @IsString()
  @MaxLength(32)
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  userType!: 'PROVIDER' | 'TRAVELER';
}
