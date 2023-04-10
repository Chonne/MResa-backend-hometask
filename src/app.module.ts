import { Module } from '@nestjs/common';
import { BuyersModule } from './buyers/buyers.module';
import { VendorsModule } from './vendors/vendors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [BuyersModule, VendorsModule, AppointmentsModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
