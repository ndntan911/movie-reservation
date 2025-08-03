import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Showtime } from 'src/modules/showtime/entities/showtime.entity';
import { Seat } from './seat.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., "Room 1", "IMAX", etc.

  @OneToMany(() => Seat, (seat) => seat.room, { cascade: true })
  seats: Seat[];

  @Column({ type: 'jsonb', nullable: true }) // PostgreSQL
  layoutGrid: Record<string, (string | null)[]>; // seat code or null for aisle

  @OneToMany(() => Showtime, (showtime) => showtime.room)
  showtimes: Showtime[];
}
