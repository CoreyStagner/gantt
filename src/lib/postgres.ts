import { Pool } from 'pg';

const host = process.env.NEXT_PUBLIC_AUTH_DATABASE_HOST;
let port: number | undefined;
if (process.env.NEXT_PUBLIC_AUTH_DATABASE_PORT) {
  port = parseInt(process.env.NEXT_PUBLIC_AUTH_DATABASE_PORT, 10);
  if (!port) {
    throw new Error('port is not a number');
  }
}
const database = process.env.NEXT_PUBLIC_AUTH_DATABASE_NAME;
const user = process.env.NEXT_PUBLIC_AUTH_DATABASE_USER;
const password = process.env.NEXT_PUBLIC_AUTH_DATABASE_PASSWORD;

const poolConfig = {
  host,
  port,
  database,
  user,
  password,
};

const pool = new Pool(poolConfig);

export { pool };
