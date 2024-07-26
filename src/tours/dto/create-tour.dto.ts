import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsNumberString,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TourDateRangeDto {
  @IsString()
  from: string;

  @IsString()
  to: string;
}

export class ProvinceCityDto {
  @IsString()
  province: string;

  @IsString()
  city: string;
}

export class CreateTourDto {
  @IsString()
  tourName: string;

  @IsString()
  tourDescription: string;

  @Type(() => TourDateRangeDto)
  duration: TourDateRangeDto;

  @IsNumberString()
  price: number;

  @IsNumberString()
  tourAttendance: number;

  @IsArray()
  tags: Array<number>;

  @IsArray()
  timeline: any;

  @IsObject()
  @ValidateNested()
  @Type(() => ProvinceCityDto)
  origin: ProvinceCityDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ProvinceCityDto)
  destination: ProvinceCityDto;
}
