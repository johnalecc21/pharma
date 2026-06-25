import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => {
  const url = process.env.DATABASE_URL;

  if (url) {
    return {
      type: 'postgres',
      url,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: false,
      migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
      migrationsRun: true,
    };
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    synchronize: false,
    migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
    migrationsRun: true,
  };
});
