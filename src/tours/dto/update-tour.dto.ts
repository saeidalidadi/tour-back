import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProvinceCityDto } from './create-tour.dto';

export class TourDateRangeDto {
  @IsString()
  from: string;

  @IsString()
  to: string;
}

export class UpdateTourDto {
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
  tags: Array<string>;

  @IsArray()
  @IsOptional()
  images: Array<{ deleted: string; id: number }>;

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
