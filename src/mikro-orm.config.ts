import { MikroORM } from "@mikro-orm/core";
import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import "dotenv/config";

console.log("password",process.env.DB_PASSWORD)

const config: Options = {
  entities: ["./dist/entities/*.entity.js"],
  entitiesTs: ["./src/entities/*.entity.ts"],
  dbName: process.env.DB_NAME, // Replace with your DB name
  user: process.env.DB_USER, // Replace with your DB user
  password: process.env.DB_PASSWORD, // Replace with your DB password
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : undefined,
  driver: PostgreSqlDriver,
  debug: true,
  migrations: {
    tableName: "mikro_orm_migrations",
    path: "migrations",
    transactional: true,
  },
  tsNode: true,
} satisfies Parameters<typeof MikroORM.init>[0];

export default config;
