import { IsArray, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  showTimeId: string;

  @IsArray()
  seatCodes: string[];
}
