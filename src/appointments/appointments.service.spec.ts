import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('AppointmentsService', () => {
  let appointmentsService: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService, PrismaService],
    }).compile();

    appointmentsService = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(appointmentsService).toBeDefined();
  });

  describe('filterByDate', () => {
    it('should return the correct filter for a given date', () => {
      const date = '2023-04-11';
      const expectedFilter = {
        OR: [
          {
            startTime: {
              gte: new Date('2023-04-11'),
              lt: new Date('2023-04-12'),
            },
          },
          {
            endTime: {
              gte: new Date('2023-04-11'),
              lt: new Date('2023-04-12'),
            },
          },
        ],
      };
      const filterByDate = jest
        .spyOn(AppointmentsService.prototype as any, 'filterByDate')
        .getMockImplementation();

      const result = filterByDate(date);

      expect(result).toEqual(expectedFilter);
    });
  });

  describe('filterByTimeRange', () => {
    it('should return the correct filter for the given time range', () => {
      const startTime = new Date('2023-04-11T08:00:00.000Z');
      const endTime = new Date('2023-04-11T09:00:00.000Z');

      const expectedFilter: Prisma.AppointmentWhereInput = {
        OR: [
          {
            startTime: { lte: startTime },
            endTime: { gt: startTime },
          },
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime },
          },
          {
            startTime: { gte: startTime },
            endTime: { lte: endTime },
          },
        ],
      };

      const filterByTimeRange = jest
        .spyOn(AppointmentsService.prototype as any, 'filterByTimeRange')
        .getMockImplementation();

      const result = filterByTimeRange(startTime, endTime);

      expect(result).toEqual(expectedFilter);
    });
  });
});
