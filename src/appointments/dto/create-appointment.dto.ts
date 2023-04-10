import { ApiProperty } from '@nestjs/swagger';
import { AppointmentType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';
import { IsBeforeConstraint } from 'src/class-validator/is-before.constraint';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsEnum(AppointmentType)
  @ApiProperty()
  type: AppointmentType;

  // Only require and set the location if the type is physical
  @ValidateIf((o) => o.type === AppointmentType.physical)
  @Transform((params) =>
    params.obj.type === AppointmentType.physical ? params.value : undefined,
  )
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  location?: string;

  // Only require and set the link if the type is virtual
  @ValidateIf((o) => o.type === AppointmentType.virtual)
  @Transform((params) =>
    params.obj.type === AppointmentType.virtual ? params.value : undefined,
  )
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  link?: string;

  @Validate(IsBeforeConstraint, ['endTime'])
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  endTime: Date;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  hostId: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  clientId: number;
}
