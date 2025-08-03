import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthRequest } from 'src/interfaces/auth-request';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';

@UseGuards(JwtGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.reservationService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.reservationService.findOne(id, req.user);
  }

  @Post()
  create(
    @Req() req: AuthRequest,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationService.create(req.user, createReservationDto);
  }
}
