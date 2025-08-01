import { Category } from 'src/modules/category/entities/category.entity';
import { Media } from 'src/modules/media/entities/media.entity';
import { Showtime } from 'src/modules/showtime/entities/showtime.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToOne(() => Media, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'posterId' })
  poster: Media;

  @Column()
  description: string;

  @OneToMany(() => Showtime, (showtime) => showtime.movie, {
    cascade: true,
  })
  showtimes: Showtime[];

  @ManyToOne(() => Category, (category) => category.movies, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  seats: number;

  @Column()
  price: number;

  @Column({ default: 0 })
  reservs: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
