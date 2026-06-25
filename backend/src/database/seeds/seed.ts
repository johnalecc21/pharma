import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Usuario } from '../../modules/usuarios/entities/usuario.entity';
import { Medicamento } from '../../modules/medicamentos/entities/medicamento.entity';
import { Venta } from '../../modules/ventas/entities/venta.entity';
import { DetalleVenta } from '../../modules/ventas/entities/detalle-venta.entity';
import { Role } from '../../common/enums/role.enum';

const SALT_ROUNDS = 10;

function fechaEnDias(dias: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString().substring(0, 10);
}

async function crearDataSource(): Promise<DataSource> {
  const url = process.env.DATABASE_URL;

  const dataSource = new DataSource({
    type: 'postgres',
    ...(url
      ? { url, ssl: { rejectUnauthorized: false } }
      : {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT) || 5432,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        }),
    entities: [Usuario, Medicamento, Venta, DetalleVenta],
    synchronize: true,
  });

  return dataSource.initialize();
}

async function seedUsuarios(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Usuario);

  const usuariosDemo = [
    { nombre: 'Admin Demo', email: 'admin@pharmadash.com', rol: Role.ADMINISTRADOR },
    { nombre: 'Farmacéutico Demo', email: 'farmaceutico@pharmadash.com', rol: Role.FARMACEUTICO },
  ];

  for (const datos of usuariosDemo) {
    const existente = await repo.findOne({ where: { email: datos.email } });
    if (existente) {
      console.log(`Usuario ya existe: ${datos.email}`);
      continue;
    }

    const usuario = new Usuario();
    usuario.nombre = datos.nombre;
    usuario.email = datos.email;
    usuario.rol = datos.rol;
    usuario.passwordHash = await bcrypt.hash('password123', SALT_ROUNDS);
    await repo.save(usuario);
    console.log(`Usuario creado: ${datos.email} / password123`);
  }
}

async function seedMedicamentos(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Medicamento);

  const medicamentosDemo = [
    { nombre: 'Paracetamol 500mg', categoria: 'Analgésicos', sku: 'PARA500', precioUnitario: 5.5, stock: 45, fechaVencimiento: fechaEnDias(180) },
    { nombre: 'Ibuprofeno 400mg', categoria: 'Analgésicos', sku: 'IBU400', precioUnitario: 6.2, stock: 30, fechaVencimiento: fechaEnDias(120) },
    { nombre: 'Amoxicilina 500mg', categoria: 'Antibióticos', sku: 'AMOX500', precioUnitario: 12.0, stock: 8, fechaVencimiento: fechaEnDias(200) },
    { nombre: 'Loratadina 10mg', categoria: 'Antialérgicos', sku: 'LORA10', precioUnitario: 4.3, stock: 60, fechaVencimiento: fechaEnDias(15) },
    { nombre: 'Omeprazol 20mg', categoria: 'Gastrointestinal', sku: 'OMEP20', precioUnitario: 7.8, stock: 5, fechaVencimiento: fechaEnDias(10) },
    { nombre: 'Vitamina C 1g', categoria: 'Suplementos', sku: 'VITC1G', precioUnitario: 9.9, stock: 25, fechaVencimiento: fechaEnDias(365) },
  ];

  for (const datos of medicamentosDemo) {
    const existente = await repo.findOne({ where: { sku: datos.sku } });
    if (existente) {
      console.log(`Medicamento ya existe: ${datos.sku}`);
      continue;
    }

    const medicamento = repo.create(datos);
    await repo.save(medicamento);
    console.log(`Medicamento creado: ${datos.nombre} (${datos.sku})`);
  }
}

async function main(): Promise<void> {
  const dataSource = await crearDataSource();
  console.log('Conectado a la base de datos. Insertando datos demo...');

  await seedUsuarios(dataSource);
  await seedMedicamentos(dataSource);

  await dataSource.destroy();
  console.log('Seed completado.');
}

main().catch((error) => {
  console.error('Error ejecutando el seed:', error);
  process.exit(1);
});
