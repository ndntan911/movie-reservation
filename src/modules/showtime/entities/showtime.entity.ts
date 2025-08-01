import { Movie } from 'src/modules/movies/entities/movie.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  time: Date;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column()
  price: number;

  @Column()
  seats: number;

  @Column({ default: 0 })
  reservedSeats: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
