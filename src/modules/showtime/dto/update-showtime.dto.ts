import { PartialType } from '@nestjs/mapped-types';
import { CreateShowtimeDto } from './create-Showtime.dto';

export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {}
