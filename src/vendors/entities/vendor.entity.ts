import { ApiProperty } from '@nestjs/swagger';
import { Vendor } from '@prisma/client';
import { AppointmentEntity } from 'src/appointments/entities/appointment.entity';

export class VendorEntity implements Vendor {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  appointments: AppointmentEntity[];
}
