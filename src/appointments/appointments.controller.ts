import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentEntity } from './entities/appointment.entity';
import { GetAppointmentsDto } from './dto/get-appointments.dto';

@Controller('appointments')
@ApiTags('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiCreatedResponse({ type: AppointmentEntity })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiQuery({
    name: 'date',
    type: 'string',
    required: false,
    description: 'format: YYYY-MM-DD',
  })
  @ApiOkResponse({ type: AppointmentEntity, isArray: true })
  findAll(@Query() query?: GetAppointmentsDto) {
    return this.appointmentsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: AppointmentEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const appointment = await this.appointmentsService.findOne(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    return appointment;
  }

  @Patch(':id')
  @ApiOkResponse({ type: AppointmentEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: AppointmentEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.remove(id);
  }
}
