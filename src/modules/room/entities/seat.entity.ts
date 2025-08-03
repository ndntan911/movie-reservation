import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Room } from './room.entity';
import { SeatType } from '../enum/seat-type.enum';

@Entity()
@Unique(['roomId', 'code'])
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column({
    type: 'enum',
    enum: SeatType,
    default: SeatType.STANDARD,
  })
  type: SeatType;

  @Column()
  price: number;

  @ManyToOne(() => Room, (room) => room.seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  roomId: string;
}
