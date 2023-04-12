import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { seedDatabase } from './seed';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from '../src/prisma-client-exception/prisma-client-exception.filter';

describe('Appointments (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  // todo: create a type for this
  let seedData: {
    buyers: { id: number; name: string; company: string }[];
    vendors: { id: number; name: string }[];
    appointments: {
      id: number;
      title: string;
      type: string;
      link: string;
      startTime: Date;
      endTime: Date;
      hostId: number;
      clientId: number;
    }[];
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    await app.init();

    prisma = app.get(PrismaService);

    seedData = await seedDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();

    await prisma.appointment.deleteMany();
    await prisma.buyer.deleteMany();
    await prisma.vendor.deleteMany();
  });

  describe('Successful requests', () => {
    it('should return an array of appointments', async () => {
      const response = await request(app.getHttpServer()).get('/appointments');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(3);
    });

    it('should return a single appointment', async () => {
      const response = await request(app.getHttpServer()).get(
        `/appointments/${seedData.appointments[0].id}`,
      );
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 2 appointments for the day', async () => {
      const response = await request(app.getHttpServer()).get(
        '/appointments?date=2023-01-01',
      );
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
    });

    it('should create a new appointment', async () => {
      const data = {
        title: 'Physical Appointment 01/02 11-12',
        type: 'physical',
        location: 'Location 1',
        startTime: '2023-01-02T11:00:00.000Z',
        endTime: '2023-01-02T12:00:00.000Z',
        hostId: seedData.vendors[0].id,
        clientId: seedData.buyers[0].id,
      };
      const response = await request(app.getHttpServer())
        .post('/appointments')
        .send(data);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(expect.objectContaining(data));
    });

    it('should create a new appointment', async () => {
      const data = {
        title: 'Phyisical Appointment 01/02 14-16',
        type: 'physical',
        location: 'Location 1',
        startTime: '2023-01-02T14:00:00.000Z',
        endTime: '2023-01-02T16:00:00.000Z',
        hostId: seedData.vendors[0].id,
        clientId: seedData.buyers[0].id,
      };
      const response = await request(app.getHttpServer())
        .post('/appointments')
        .send(data);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(expect.objectContaining(data));
    });

    it('should create a new appointment', async () => {
      const data = {
        title: 'Physical Appointment 01/02 17-17:30',
        type: 'physical',
        location: 'Location 1',
        startTime: '2023-01-02T17:00:00.000Z',
        endTime: '2023-01-02T17:30:00.000Z',
        hostId: seedData.vendors[0].id,
        clientId: seedData.buyers[0].id,
      };
      const response = await request(app.getHttpServer())
        .post('/appointments')
        .send(data);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(expect.objectContaining(data));
    });

    it('should return an array of 6 appointments', async () => {
      const response = await request(app.getHttpServer()).get('/appointments');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(6);
    });

    it('should update an existing appointment', async () => {
      const data = {
        type: 'virtual',
        link: 'https://meet.google.com/lookup/abc123',
      };
      const response = await request(app.getHttpServer())
        .patch(`/appointments/${seedData.appointments[1].id}`)
        .send(data);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(expect.objectContaining(data));
    });

    it('should delete an existing appointment', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/appointments/${seedData.appointments[1].id}`,
      );
      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should return a not found response for the deleted appointment', async () => {
      const response = await request(app.getHttpServer()).get(
        `/appointments/${seedData.appointments[1].id}`,
      );
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('Error requests', () => {
    it('should return a bad request response for an invalid date', async () => {
      const response = await request(app.getHttpServer()).get(
        '/appointments?date=plop',
      );
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should create a new appointment', async () => {
      const data = {
        title: 'Physical Appointment 01/03 08-12',
        type: 'physical',
        location: 'Location 1',
        startTime: '2023-01-03T08:00:00.000Z',
        endTime: '2023-01-03T12:00:00.000Z',
        hostId: seedData.vendors[0].id,
        clientId: seedData.buyers[0].id,
      };
      const response = await request(app.getHttpServer())
        .post('/appointments')
        .send(data);
      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('should return a conflict response for an overlapping appointment', async () => {
      const data = {
        title: 'Physical Appointment 01/03 10-13',
        type: 'physical',
        location: 'Location 1',
        startTime: '2023-01-03T10:00:00.000Z',
        endTime: '2023-01-03T13:00:00.000Z',
        hostId: seedData.vendors[0].id,
        clientId: seedData.buyers[0].id,
      };
      const response = await request(app.getHttpServer())
        .post('/appointments')
        .send(data);
      expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    it('should return a conflict response for an already existing title', async () => {
      const data = {
        title: 'Physical Appointment 01/02 12-14',
        type: 'physical',
        location: 'Location 1',
        startTime: '2023-01-03T11:00:00.000Z',
        endTime: '2023-01-03T12:00:00.000Z',
        hostId: seedData.vendors[0].id,
        clientId: seedData.buyers[0].id,
      };
      const response = await request(app.getHttpServer())
        .post('/appointments')
        .send(data);
      expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    it('should return a bad request response for a missing location for a physical appointment', async () => {
      const data = {
        title: 'Physical Appointment 01/03 11-12',
        type: 'physical',
        link: 'https://meet.google.com/lookup/abc123',
        startTime: '2023-01-03T11:00:00.000Z',
        endTime: '2023-01-03T12:00:00.000Z',
        hostId: seedData.vendors[0].id,
        clientId: seedData.buyers[0].id,
      };
      const response = await request(app.getHttpServer())
        .post('/appointments')
        .send(data);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return a bad request for missing fields', async () => {
      const data = {
        title: 'Physical Appointment 01/03 12-14',
        type: 'physical',
        location: 'https://meet.google.com/lookup/abc123',
        startTime: '2023-01-03T12:00:00.000Z',
        hostId: seedData.vendors[0].id,
        clientId: seedData.buyers[0].id,
      };
      const response = await request(app.getHttpServer())
        .post('/appointments')
        .send(data);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
