import databaseConfig from './database.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

describe('databaseConfig', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it('usa DATABASE_URL con SSL cuando está definida', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@host/db';
    process.env.NODE_ENV = 'development';

    const config = databaseConfig() as TypeOrmModuleOptions & { url?: string };

    expect(config.url).toBe('postgresql://user:pass@host/db');
    expect(config.synchronize).toBe(false);
    expect(config.migrationsRun).toBe(true);
  });

  it('usa variables DB_* individuales cuando no hay DATABASE_URL', () => {
    delete process.env.DATABASE_URL;
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';
    process.env.DB_DATABASE = 'pharma';
    process.env.NODE_ENV = 'production';

    const config = databaseConfig() as TypeOrmModuleOptions & { host?: string; port?: number };

    expect(config.host).toBe('localhost');
    expect(config.port).toBe(5432);
    expect(config.synchronize).toBe(false);
  });

  it('usa el puerto 5432 por defecto cuando DB_PORT no está definido', () => {
    delete process.env.DATABASE_URL;
    delete process.env.DB_PORT;

    const config = databaseConfig() as TypeOrmModuleOptions & { port?: number };

    expect(config.port).toBe(5432);
  });
});
