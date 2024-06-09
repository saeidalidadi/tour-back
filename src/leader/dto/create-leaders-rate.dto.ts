import { IsNumber, Max, Min } from 'class-validator';

export class CreateLeadersRateDto {
  @IsNumber({ allowNaN: false })
  @Max(5)
  @Min(1)
  rate: number;
}
