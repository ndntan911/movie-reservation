import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DbModule } from './modules/db/db.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MoviesModule } from './modules/movies/movies.module';
import { CategoryModule } from './modules/category/category.module';
import { MediaModule } from './modules/media/media.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderModule } from './modules/order/order.module';
import { EmailsModule } from './modules/emails/emails.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { ShowtimeModule } from './modules/showtime/showtime.module';
import { RoomModule } from './modules/room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: {
        expiresIn: '30d',
      },
    }),
    DbModule,
    AuthModule,
    UsersModule,
    MoviesModule,
    CategoryModule,
    MediaModule,
    SupabaseModule,
    ShowtimeModule,
    ReservationModule,
    PaymentModule,
    OrderModule,
    EmailsModule,
    SchedulingModule,
    RoomModule,
  ],
})
export class AppModule {}
