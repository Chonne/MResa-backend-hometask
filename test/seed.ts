import { PrismaService } from 'src/prisma/prisma.service';

export const seedDatabase = async (
  prisma: PrismaService,
): Promise<{
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
}> => {
  const buyers = await Promise.all([
    prisma.buyer.create({
      data: {
        name: 'Buyer 1',
        company: 'Company 1',
      },
    }),
    prisma.buyer.create({
      data: {
        name: 'Buyer 2',
        company: 'Company 1',
      },
    }),
    prisma.buyer.create({
      data: {
        name: 'Buyer 3',
        company: 'Company 2',
      },
    }),
  ]);

  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        name: 'Vendor 1',
      },
    }),
    prisma.vendor.create({
      data: {
        name: 'Vendor 2',
      },
    }),
  ]);

  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        title: 'Virtual Appointment 01/01 10-12',
        type: 'virtual',
        link: 'https://www.example.com',
        startTime: new Date('2023-01-01T10:00:00.000Z'),
        endTime: new Date('2023-01-01T12:00:00.000Z'),
        hostId: vendors[0].id,
        clientId: buyers[0].id,
      },
    }),
    prisma.appointment.create({
      data: {
        title: 'Physical Appointment 01/01 12-14',
        type: 'physical',
        location: 'Location 1',
        startTime: new Date('2023-01-01T12:00:00.000Z'),
        endTime: new Date('2023-01-01T14:00:00.000Z'),
        hostId: vendors[1].id,
        clientId: buyers[0].id,
      },
    }),
    prisma.appointment.create({
      data: {
        title: 'Physical Appointment 01/02 12-14',
        type: 'physical',
        location: 'Location 1',
        startTime: new Date('2023-01-02T12:00:00.000Z'),
        endTime: new Date('2023-01-02T14:00:00.000Z'),
        hostId: vendors[1].id,
        clientId: buyers[0].id,
      },
    }),
  ]);

  return {
    buyers,
    vendors,
    appointments,
  };
};
