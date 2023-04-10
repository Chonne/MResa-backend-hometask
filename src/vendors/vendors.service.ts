import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  create(createVendorDto: CreateVendorDto) {
    return this.prisma.vendor.create({ data: createVendorDto });
  }

  findAll() {
    return this.prisma.vendor.findMany();
  }

  findOne(id: number) {
    return this.prisma.vendor.findUnique({
      where: { id },
      include: { appointments: true },
    });
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return this.prisma.vendor.update({
      where: { id },
      data: updateVendorDto,
    });
  }

  async remove(id: number) {
    // Delete vendor only if it has no appointments
    const vendor = await this.findOne(id);

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.appointments.length > 0) {
      throw new ConflictException('Vendor has appointments');
    }

    return this.prisma.vendor.delete({ where: { id } });
  }
}
