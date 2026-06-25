import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import { Medicamento } from '../modules/medicamentos/entities/medicamento.entity';
import { Venta } from '../modules/ventas/entities/venta.entity';
import { DetalleVenta } from '../modules/ventas/entities/detalle-venta.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';

const entidades = [Usuario, Medicamento, Venta, DetalleVenta, RefreshToken];

const url = process.env.DATABASE_URL;

const opciones: DataSourceOptions = url
  ? {
      type: 'postgres',
      url,
      ssl: { rejectUnauthorized: false },
      entities: entidades,
      migrations: [__dirname + '/migrations/*.{ts,js}'],
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: entidades,
      migrations: [__dirname + '/migrations/*.{ts,js}'],
    };

export default new DataSource(opciones);
