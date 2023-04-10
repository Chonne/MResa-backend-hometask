import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorEntity } from './entities/vendor.entity';

@Controller('vendors')
@ApiTags('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @ApiCreatedResponse({ type: VendorEntity })
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  @ApiOkResponse({ type: VendorEntity, isArray: true })
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: VendorEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const vendor = await this.vendorsService.findOne(id);
    if (!vendor) {
      throw new NotFoundException(`Vendor #${id} not found`);
    }

    return vendor;
  }

  @Patch(':id')
  @ApiOkResponse({ type: VendorEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: VendorEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vendorsService.remove(id);
  }
}
