import { Module } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { BuyersController } from './buyers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BuyersController],
  providers: [BuyersService],
  imports: [PrismaModule],
})
export class BuyersModule {}
