import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Category } from 'src/modules/category/entities/category.entity';

async function bootstrap() {
  const app = await NestFactory.create<
    INestApplication<NestExpressApplication>
  >(AppModule, {
    rawBody: true,
  });

  const dataSource = app.get(DataSource);

  const categoryRepo = dataSource.getRepository(Category);

  const categories = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Thriller',
    'Animation',
    'Documentary',
    'Family',
    'Musical',
    'War',
    'Western',
    'Crime',
    'History',
    'Biography',
    'Sport',
  ];

  for (const name of categories) {
    const exists = await categoryRepo.findOne({ where: { name } });
    if (!exists) {
      await categoryRepo.save(categoryRepo.create({ name }));
    }
  }

  await app.close();
}
bootstrap();
