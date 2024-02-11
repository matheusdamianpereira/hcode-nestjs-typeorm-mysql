import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({
  path: process.env.ENV === 'test' ? '.env.test' : '.env',
});

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrations: [`${__dirname}/migrations/**/*.ts`],
});

export default dataSource;
