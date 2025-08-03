import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { ShowtimeService } from '../showtime/Showtime.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    private readonly showtimeService: ShowtimeService,
  ) {}

  create(user: JwtPayload, { showTimeId, seatCodes }: CreateReservationDto) {
    return this.reservationRepo.save({
      showtime: { id: showTimeId },
      user: { id: user.id },
      seatCodes: seatCodes.join(','),
    });
  }

  findAll(user: JwtPayload) {
    const Q = this.reservationRepo
      .createQueryBuilder('reservation')
      .where('reservation.userId = :id', { id: user.id })
      .select(['reservation.id', 'reservation.createdAt']);

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
      .leftJoinAndSelect('reservation.showtime', 'showtime')
      .where('reservation.id = :id AND reservation.userId = :userId', {
        id,
        userId: user.id,
      })
      .select([
        'reservation.id',
        'reservation.createdAt',
        'showtime.time',
        'reservation.seatCodes',
      ])
      .getOne();

    if (!reservation) throw new NotFoundException('reservation not found');

    return reservation;
  }

  async remove(id: string, user: JwtPayload) {
    const reservation = await this.findOne(id, user);
    if (!reservation) throw new NotFoundException();

    return this.reservationRepo.delete({ user: { id: user.id }, id });
  }

  async cleanUpExpiredReservations(cutoff: Date) {
    const expiredReservations = await this.reservationRepo
      .createQueryBuilder('reservation')
      .where('reservation.createdAt < :cutoff', { cutoff })
      .andWhere('reservation.orderId IS NULL')
      .getMany();

    await this.reservationRepo.remove(expiredReservations);
  }

  async getTakenSeatsForShowtime(
    reservationId: string,
    showtimeId: string,
    seatCodes: string[],
  ): Promise<string[]> {
    const takenReservations = await this.reservationRepo.find({
      where: {
        showtime: { id: showtimeId },
        id: Not(reservationId),
      },
      select: ['seatCodes'],
    });

    const takenSeats = new Set<string>();
    for (const reservation of takenReservations) {
      const codes = reservation.seatCodes.split(',').map((code) => code.trim());
      for (const code of codes) {
        if (seatCodes.includes(code)) {
          takenSeats.add(code);
        }
      }
    }

    return Array.from(takenSeats);
  }

  async addOrder(reservationId: string, orderId: string) {
    await this.reservationRepo.update(reservationId, {
      order: { id: orderId },
    });
  }
}
