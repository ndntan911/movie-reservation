import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { ShowtimeService } from '../showtime/Showtime.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    private readonly showtimeService: ShowtimeService,
  ) {}

  create({ movieId, seats }: CreateReservationDto, userId: string) {
    return this.reservationRepo.save({
      movie: { id: movieId },
      user: { id: userId },
      seats,
    });
  }

  findAll(user: JwtPayload) {
    const Q = this.reservationRepo
      .createQueryBuilder('reservation')
      .where('reservation.userId = :id', { id: user.id })
      .select(['reservation.id', 'reservation.createdAt', 'reservation.seats']);

    return Q.getMany();
  }

  findAllOfUsers(showtime: Date, currentDate: Date) {
    const Q = this.reservationRepo
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.movie', 'movie')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('movie.poster', 'poster')
      .where('movie.showtime BETWEEN :currentDate AND :showtime', {
        currentDate,
        showtime,
      })
      .select([
        'reservation.id',
        'reservation.seats',
        'reservation.createdAt',
        'user.id',
        'user.name',
        'user.email',
        'movie.id',
        'movie.title',
        'movie.showtime',
        'poster.url',
      ]);

    return Q.getMany();
  }

  async findOne(id: string, user: JwtPayload) {
    const reservation = await this.reservationRepo
      .createQueryBuilder('reservation')
      .where('reservation.id = :id AND reservation.userId = :userId', {
        id,
        userId: user.id,
      })
      .select(['reservation.id', 'reservation.createdAt', 'reservation.seats'])
      .getOne();

    if (!reservation) throw new NotFoundException('reservation not found');

    return reservation;
  }

  async remove(id: string, user: JwtPayload) {
    const reservation = await this.findOne(id, user);
    if (!reservation) throw new NotFoundException();

    await this.showtimeService.update(reservation.showtime.id, {
      reservedSeats: reservation.showtime.reservedSeats - reservation.seats,
    });

    return this.reservationRepo.delete({ user: { id: user.id }, id });
  }
}
