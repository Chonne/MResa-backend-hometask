import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Using upsert instead of create in case the data already exists, to avoid
  // duplicate key errors
  const buyers = await Promise.all([
    prisma.buyer.upsert({
      where: {
        name: 'Buyer101',
      },
      update: {},
      create: {
        name: 'Buyer101',
        company: 'company1',
      },
    }),
    prisma.buyer.upsert({
      where: {
        name: 'Buyer102',
      },
      update: {},
      create: {
        name: 'Buyer102',
        company: 'company1',
      },
    }),
    prisma.buyer.upsert({
      where: {
        name: 'Buyer201',
      },
      update: {},
      create: {
        name: 'Buyer201',
        company: 'company2',
      },
    }),
    prisma.buyer.upsert({
      where: {
        name: 'Buyer202',
      },
      update: {},
      create: {
        name: 'Buyer202',
        company: 'company2',
      },
    }),
    prisma.buyer.upsert({
      where: {
        name: 'Buyer203',
      },
      update: {},
      create: {
        name: 'Buyer203',
        company: 'company2',
      },
    }),
  ]);

  const vendors = await Promise.all([
    prisma.vendor.upsert({
      where: {
        name: 'Vendor1',
      },
      update: {},
      create: {
        name: 'Vendor1',
      },
    }),
    prisma.vendor.upsert({
      where: {
        name: 'Vendor2',
      },
      update: {},
      create: {
        name: 'Vendor2',
      },
    }),
    prisma.vendor.upsert({
      where: {
        name: 'Vendor3',
      },
      update: {},
      create: {
        name: 'Vendor3',
      },
    }),
  ]);

  // todo: use the enum values for type (not sure how)
  await Promise.all([
    prisma.appointment.upsert({
      where: {
        title: 'virtual appointment1',
      },
      update: {},
      create: {
        title: 'virtual appointment1',
        type: 'virtual',
        link: 'link1',
        startTime: new Date(2023, 1, 4, 10, 0),
        endTime: new Date(2023, 1, 4, 12, 0),
        hostId: vendors[0].id,
        clientId: buyers[0].id,
      },
    }),
    prisma.appointment.upsert({
      where: {
        title: 'physical appointment2',
      },
      update: {},
      create: {
        title: 'physical appointment2',
        type: 'physical',
        location: 'location1',
        startTime: new Date(2023, 1, 5, 9, 0),
        endTime: new Date(2023, 1, 5, 12, 0),
        hostId: vendors[1].id,
        clientId: buyers[1].id,
      },
    }),
    prisma.appointment.upsert({
      where: {
        title: 'virtual appointment3',
      },
      update: {},
      create: {
        title: 'virtual appointment3',
        type: 'virtual',
        link: 'link2',
        startTime: new Date(2023, 1, 4, 12, 0),
        endTime: new Date(2023, 1, 4, 15, 0),
        hostId: vendors[2].id,
        clientId: buyers[2].id,
      },
    }),
    prisma.appointment.upsert({
      where: {
        title: 'physical appointment4',
      },
      update: {},
      create: {
        title: 'physical appointment4',
        type: 'physical',
        location: 'location2',
        startTime: new Date(2023, 1, 6, 14, 0),
        endTime: new Date(2023, 1, 6, 18, 0),
        hostId: vendors[0].id,
        clientId: buyers[2].id,
      },
    }),
  ]);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
