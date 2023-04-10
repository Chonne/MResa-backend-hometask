import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, MaxLength } from 'class-validator';

export class GetAppointmentsDto {
  @IsDateString()
  @IsOptional()
  @MaxLength(10)
  @ApiProperty()
  date: string;
}
