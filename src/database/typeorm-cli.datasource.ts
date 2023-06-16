import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import dotenv from 'dotenv';

dotenv.config();

const dataSource = addTransactionalDataSource(
  new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/entities/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: false,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
  } as DataSourceOptions),
);
export default dataSource;
