import {
  ConflictException,
  forwardRef,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { OrderStatus } from './enums/order-status.enum';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaymentService } from '../payment/payment.service';
import { ReservationService } from '../reservation/reservation.service';
import { EmailsService } from '../emails/emails.service';
import { createOrderTemp } from '../emails/templates/create-order.template';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly reservationService: ReservationService,
    private readonly emailsService: EmailsService,
  ) {}
  async create({ reservationId }: CreateOrderDto, user: JwtPayload) {
    const checkOrder = await this.orderRepo.existsBy({
      reservation: { id: reservationId },
    });

    if (checkOrder)
      throw new ConflictException(
        'movie has been in order go to complete payment or canceled',
      );

    const reservation = await this.reservationService.findOne(
      reservationId,
      user,
    );

    const currentDate = Date.now();
    const showtime = reservation.showtime.time.getTime();
    if (showtime < currentDate) throw new GoneException('showtime is over');

    // Validate seat
    const seatCodes = reservation.seatCodes
      .split(',')
      .map((code) => code.trim());

    const takenSeats = await this.reservationService.getTakenSeatsForShowtime(
      reservation.id,
      reservation.showtime.id,
      seatCodes,
    );

    if (takenSeats.length > 0) {
      throw new ConflictException(
        `The following seats are already taken: ${takenSeats.join(', ')}`,
      );
    }

    const order = await this.orderRepo.save({
      user: { id: user.id },
      status: OrderStatus.PENDING,
      reservation: { id: reservation.id },
    });
    await this.reservationService.addOrder(reservation.id, order.id);
    this.emailsService.sendEmail({
      to: user.email,
      subject: 'create order',
      html: createOrderTemp(order.id, reservation.showtime.movie, user.name),
    });
    return { msg: 'order is created' };
  }

  findAll(user: JwtPayload) {
    return this.orderRepo.find({
      where: { user: { id: user.id } },
      select: ['id', 'total', 'status', 'createdAt', 'paymentId'],
    });
  }

  findOne(id: string, userId: string) {
    return this.orderRepo.findOne({
      where: { id, user: { id: userId } },
      select: {
        id: true,
        total: true,
        status: true,
        paymentId: true,
        reservation: { id: true },
      },
      relations: ['reservation'],
    });
  }

  async update(id: string, data: UpdateOrderDto) {
    const order = await this.orderRepo.findOneBy({ id });
    await this.orderRepo.save({ ...order, ...data });
    return { msg: 'order has been updated' };
  }

  async remove(id: string, user: JwtPayload) {
    const order = await this.findOne(id, user.id);
    if (!order) throw new NotFoundException('order not found');

    await this.reservationService.remove(order.reservation.id, user);

    await this.paymentService.cancelPayment(order.paymentId);

    return this.orderRepo.delete({ id, user: { id: user.id } });
  }
}
