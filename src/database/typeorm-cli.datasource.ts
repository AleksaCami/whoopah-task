import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

const dataSource = addTransactionalDataSource(
  new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'whoopah',
    password: 'whoopah',
    database: 'whoopah',
    entities: [__dirname + '/entities/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: false,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
  } as DataSourceOptions),
);
export default dataSource;
