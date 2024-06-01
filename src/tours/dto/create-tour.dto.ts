import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class TourDateRangeDto {
  @IsString()
  from: string;

  @IsString()
  to: string;
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
}
