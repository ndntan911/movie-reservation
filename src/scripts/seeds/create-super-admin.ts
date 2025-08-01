import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/modules/users/entities/user.entity';
import { RoleType } from 'src/modules/auth/enums/roleType.enum';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<
    INestApplication<NestExpressApplication>
  >(AppModule, {
    rawBody: true,
  });

  const dataSource = app.get(DataSource);

  const userRepo = dataSource.getRepository(User);

  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;

  const existingAdmin = await userRepo.findOneBy({
    email,
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);

    const superAdmin = userRepo.create({
      email: email,
      name: 'Super Admin',
      password: passwordHash,
      role: RoleType.SUPER_ADMIN,
    });

    await userRepo.save(superAdmin);
    console.log('✅ Super admin created.');
  } else {
    console.log('⚠️ Super admin already exists.');
  }

  await app.close();
}
bootstrap();
