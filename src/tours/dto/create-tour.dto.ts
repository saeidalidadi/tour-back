import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
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

  @IsNumber()
  price: number;

  @IsNumber()
  tourAttendance: number;

  @IsArray()
  tags: Array<number>;

  @IsArray()
  images: Array<string>;

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
