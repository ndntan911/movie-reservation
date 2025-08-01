import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from './entities/Showtime.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepo: Repository<Showtime>,
  ) {}
  create(createShowtimeDto: CreateShowtimeDto) {
    const { movieId, time } = createShowtimeDto;

    const showtime = this.showtimeRepo.create({
      time,
      movie: { id: movieId }, // this correctly sets up the relation
    });

    return this.showtimeRepo.save(showtime);
  }

  findAll() {
    return this.showtimeRepo.find({
      select: {
        id: true,
        time: true,
        movie: {
          id: true,
          title: true,
        },
      },
      relations: ['movie'],
    });
  }

  findOne(id: string) {
    return this.showtimeRepo.findOne({
      where: { id },
      select: {
        id: true,
        time: true,
        movie: {
          id: true,
          title: true,
        },
      },
      relations: ['movie'],
    });
  }

  async update(id: string, updateShowtimeDto: UpdateShowtimeDto) {
    const showtime = await this.findOne(id);
    if (!showtime) throw new NotFoundException('Showtime not found');
    return this.showtimeRepo.save({
      ...showtime,
      ...updateShowtimeDto,
      movie: { id: updateShowtimeDto.movieId || showtime.movie.id },
    });
  }

  remove(id: string) {
    return this.showtimeRepo.delete({ id });
  }
}
