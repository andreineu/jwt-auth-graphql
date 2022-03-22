import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const options = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1734",
  database: "jwt-auth-example",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
};
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1734",
  database: "jwt-auth-example",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
