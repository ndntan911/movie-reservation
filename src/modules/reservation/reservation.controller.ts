import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthRequest } from 'src/interfaces/auth-request';
import { JwtGuard } from '../auth/guards/jwt.guard';

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
}
