import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AppointmentEntity } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns the where params to filter for a specific day
   * @param {string} date format: YYYY-MM-DD. This is not enforced
   * @returns a filter object to add to a `where` option
   */
  private filterByDate(date: string): Prisma.AppointmentWhereInput {
    const dateFilter = {
      gte: new Date(date),
      lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
    };

    return {
      OR: [{ startTime: { ...dateFilter } }, { endTime: { ...dateFilter } }],
    };
  }

  private filterByTimeRange(
    startTime: Date,
    endTime: Date,
  ): Prisma.AppointmentWhereInput {
    return {
      OR: [
        {
          startTime: { lte: startTime },
          endTime: { gte: startTime },
        },
        {
          startTime: { lte: endTime },
          endTime: { gte: endTime },
        },
        {
          startTime: { gte: startTime },
          endTime: { lte: endTime },
        },
      ],
    };
  }

  private getConflictingAppointments(
    startTime: Date,
    endTime: Date,
    entityId: number,
    entityType: 'host' | 'client',
  ) {
    const filter =
      entityType === 'host' ? { hostId: entityId } : { clientId: entityId };
    return this.prisma.appointment.findMany({
      where: {
        AND: [filter, this.filterByTimeRange(startTime, endTime)],
      },
    });
  }

  private throwConflictException(
    entityName: string,
    conflictingAppointments: AppointmentEntity[],
  ) {
    const errorMessage = `${entityName} has conflicting appointments:
  ${conflictingAppointments
    .map(
      (appointment) =>
        `- ${
          appointment.title
        }: ${appointment.startTime.toISOString()} - ${appointment.endTime.toISOString()}`,
    )
    .join('\n')}`;

    throw new ConflictException(errorMessage);
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    let conflictingAppointments = await this.getConflictingAppointments(
      createAppointmentDto.startTime,
      createAppointmentDto.endTime,
      createAppointmentDto.hostId,
      'host',
    );

    if (conflictingAppointments.length > 0) {
      this.throwConflictException('Host', conflictingAppointments);
    }

    conflictingAppointments = await this.getConflictingAppointments(
      createAppointmentDto.startTime,
      createAppointmentDto.endTime,
      createAppointmentDto.hostId,
      'client',
    );

    if (conflictingAppointments.length > 0) {
      this.throwConflictException('Client', conflictingAppointments);
    }

    return this.prisma.appointment.create({ data: createAppointmentDto });
  }

  findAll({
    date,
    hostId,
    clientId,
  }: { date?: string; hostId?: number; clientId?: number } = {}) {
    const options: Prisma.AppointmentFindManyArgs = {};

    if (date) {
      options.where = { ...this.filterByDate(date) };
    }

    if (hostId) {
      options.where = { ...options.where, hostId };
    }

    if (clientId) {
      options.where = { ...options.where, clientId };
    }

    return this.prisma.appointment.findMany(options);
  }

  findOne(id: number) {
    return this.prisma.appointment.findUnique({ where: { id } });
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
    });
  }

  remove(id: number) {
    return this.prisma.appointment.delete({ where: { id } });
  }
}
