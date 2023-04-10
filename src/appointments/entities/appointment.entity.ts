import { ApiProperty } from '@nestjs/swagger';
import { Appointment, AppointmentType } from '@prisma/client';

export class AppointmentEntity implements Appointment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  type: AppointmentType;

  @ApiProperty()
  location: string | null;

  @ApiProperty()
  link: string | null;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  hostId: number; // Vendor;

  @ApiProperty()
  clientId: number; // Buyer;
}
