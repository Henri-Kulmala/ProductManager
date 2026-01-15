import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { createId } from "@paralleldrive/cuid2";

export type ProductRow = {
  id: string;
  name: string;
  ingredients: string | null;
  allergens: string | null;
  size: string | null;
  price: string | null;
  EAN: string | null;
  photoUrl: string | null;
  producer: string | null;
  producedIn: string | null;
  ECodes: string | null;
  preservation: string | null;
  energia: string | null;
  rasva: string | null;
  hiilarit: string | null;
  sokerit_yht: string | null;
  sokerit_lis: string | null;
  proteiini: string | null;
  suola: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Database = {
  Product: ProductRow;
};

declare global {
  var __kysely: Kysely<Database> | undefined;
}

export const db =
  global.__kysely ??
  new Kysely<Database>({
    dialect: new MysqlDialect({
      pool: createPool({
        uri: process.env.DATABASE_URL,
        connectionLimit: 10,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      }),
    }),
  });

if (process.env.NODE_ENV !== "production") global.__kysely = db;

export function newId() {
  return createId();
}
