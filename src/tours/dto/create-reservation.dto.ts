import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { GenderEnum } from '../../enums';

export class Attendee {
  @IsString()
  fullName: string;

  @IsString()
  nationalId: string;

  @IsString()
  mobile: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;
}

export class CreateReservationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attendee)
  attendees: Attendee[];
}
