import { IsNumber, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  movieId: string;

  @IsNumber()
  seats: number;
}
