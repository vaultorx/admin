import { ConnectionOptions, DatabaseDialect } from '@adminjs/sql';

export const databaseType = process.env.DATABASE_DIALECT as DatabaseDialect;

export const connectionOptions: ConnectionOptions = {
  connectionString: process.env.DATABASE_URL,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  port: parseInt(process.env.DATABASE_PORT, 10),
  schema: 'public',
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
        rejectUnauthorized: false, // Required for Supabase/Render
      }
      : undefined,
  connectTimeout: 10000,
};
