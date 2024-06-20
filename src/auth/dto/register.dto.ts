import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { GenderEnum } from '../../enums';

export class RegisterDto {
  @ApiProperty()
  @IsAlpha('fa-IR')
  firstName: string;

  @ApiProperty()
  @IsAlpha('fa-IR')
  lastName: string;

  @ApiProperty({ description: 'Register with email or mobile as username' })
  @ValidateIf((o) => !o.mobile)
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Register with email or mobile as username' })
  @ValidateIf((o) => !o.email)
  @Matches(/^\d+$/)
  @Length(11)
  mobile: string;

  @IsNumber()
  acceptPolicy: number;
  // @ApiProperty({ maxLength: 32, minLength: 8 })
  // @IsString()
  // @MaxLength(32)
  // @MinLength(8)
  // password: string;

  @IsString()
  @IsOptional()
  userType!: 'PROVIDER' | 'TRAVELER';

  @IsEnum(GenderEnum)
  gender: GenderEnum;
}
