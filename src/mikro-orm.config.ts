import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';
import { Offer } from './entities/Offer';
import 'dotenv/config'

export default {
  entities: [Offer],
  dbName: 'flipkart_offers',        // Replace with your DB name
  user: 'postgres',                 // Replace with your DB user
  password: 'yourpassword',        // Replace with your DB password
  host: 'localhost',
  port: 5432,
  driver: PostgreSqlDriver,
  debug: true,
  migrations: {
    path: path.join(__dirname, './migrations'),
    pathTs: path.join(__dirname, './migrations'),
    emit: 'ts',
  },
  tsNode: true,
} satisfies Parameters<typeof MikroORM.init>[0];
