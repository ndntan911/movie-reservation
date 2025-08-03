import { Module, OnModuleInit } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [ReservationModule],
  providers: [SchedulingService],
})
export class SchedulingModule implements OnModuleInit {
  constructor(private readonly schedulingService: SchedulingService) {}
  onModuleInit() {
    // send emails to users for coming reservation
    this.schedulingService.comingMovie();
    this.schedulingService.reservationCleanup();
  }
}
