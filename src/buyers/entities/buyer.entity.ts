import { ApiProperty } from '@nestjs/swagger';
import { Buyer } from '@prisma/client';
import { AppointmentEntity } from 'src/appointments/entities/appointment.entity';

export class BuyerEntity implements Buyer {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  appointments: AppointmentEntity[];
}
