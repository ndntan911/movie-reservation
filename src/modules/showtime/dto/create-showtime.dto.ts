import { IsString } from 'class-validator';

export class CreateShowtimeDto {
  @IsString()
  movieId: string;

  @IsString()
  time: Date;
}
