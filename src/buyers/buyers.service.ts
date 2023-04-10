import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BuyersService {
  constructor(private prisma: PrismaService) {}

  create(createBuyerDto: CreateBuyerDto) {
    return this.prisma.buyer.create({ data: createBuyerDto });
  }

  findAll({ name, company }: { name?: string; company?: string } = {}) {
    const where: Prisma.BuyerWhereInput = {};

    // todo: figure out a better way to filter by name and company
    if (name) {
      where.name = { contains: name };
    }

    if (company) {
      where.company = { contains: company };
    }

    return this.prisma.buyer.findMany({ where });
  }

  findOne(id: number) {
    return this.prisma.buyer.findUnique({
      where: { id },
      include: { appointments: true },
    });
  }

  update(id: number, updateBuyerDto: UpdateBuyerDto) {
    return this.prisma.buyer.update({
      where: { id },
      data: updateBuyerDto,
    });
  }

  async remove(id: number) {
    // Delete buyer only if it has no appointments
    const buyer = await this.findOne(id);

    if (!buyer) {
      throw new NotFoundException('Buyer not found');
    }

    if (buyer.appointments.length > 0) {
      throw new ConflictException('Buyer has appointments');
    }
    return this.prisma.buyer.delete({ where: { id } });
  }
}
