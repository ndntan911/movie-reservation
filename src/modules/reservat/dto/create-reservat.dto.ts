import { IsNumber, IsUUID } from 'class-validator';

export class CreateReservatDto {
  @IsUUID()
  movieId: string;

  @IsNumber()
  seats: number;
}
