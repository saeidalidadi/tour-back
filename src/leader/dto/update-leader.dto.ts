import { Type } from 'class-transformer';
import { IsObject, IsString, Max, Min, ValidateNested } from 'class-validator';

export class LeaderDto {
  @IsString()
  @Min(30, { message: 'Is less than 30 chars' })
  @Max(300)
  intro: string;
}

export class UpdateLeaderDto {
  @IsObject()
  @ValidateNested()
  @Type(() => LeaderDto)
  leader: LeaderDto;
}
