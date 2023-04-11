import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsModule } from '../src/appointments/appointments.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { seedDatabase } from './seed';
import { AppointmentEntity } from '../src/appointments/entities/appointment.entity';

describe('Appointments (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppointmentsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    await seedDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();

    await prisma.appointment.deleteMany();
    await prisma.buyer.deleteMany();
    await prisma.vendor.deleteMany();
  });

  describe('Successful appointments', () => {
    let listAppointments = [];

    it('should return an array of appointments', async () => {
      const response = await request(app.getHttpServer()).get('/appointments');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(3);

      listAppointments = response.body;
    });

    it('should return a single appointment', async () => {
      const response = await request(app.getHttpServer()).get(
        `/appointments/${listAppointments[0].id}`,
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
        hostId: listAppointments[0].hostId,
        clientId: listAppointments[0].clientId,
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
        hostId: listAppointments[0].hostId,
        clientId: listAppointments[0].clientId,
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
        hostId: listAppointments[0].hostId,
        clientId: listAppointments[0].clientId,
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
        .patch(`/appointments/${listAppointments[1].id}`)
        .send(data);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(expect.objectContaining(data));
    });

    it('should delete an existing appointment', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/appointments/${listAppointments[1].id}`,
      );
      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should return a not found response for the deleted appointment', async () => {
      const response = await request(app.getHttpServer()).get(
        `/appointments/${listAppointments[1].id}`,
      );
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
