import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BuyersService } from './buyers.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { BuyerEntity } from './entities/buyer.entity';

@Controller('buyers')
@ApiTags('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @Post()
  @ApiCreatedResponse({ type: BuyerEntity })
  create(@Body() createBuyerDto: CreateBuyerDto) {
    return this.buyersService.create(createBuyerDto);
  }

  @Get()
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'company', required: false })
  @ApiOkResponse({ type: BuyerEntity, isArray: true })
  findAll(@Query('name') name?: string, @Query('company') company?: string) {
    return this.buyersService.findAll({ name, company });
  }

  @Get(':id')
  @ApiOkResponse({ type: BuyerEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const buyer = await this.buyersService.findOne(id);
    if (!buyer) {
      throw new NotFoundException(`Buyer #${id} not found`);
    }

    return buyer;
  }

  @Patch(':id')
  @ApiOkResponse({ type: BuyerEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBuyerDto: UpdateBuyerDto,
  ) {
    return this.buyersService.update(id, updateBuyerDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: BuyerEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.buyersService.remove(id);
  }
}
