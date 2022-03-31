import { Client, Pool, PoolClient } from "pg";
import PostgresTable from "./Table";

export default class PostgresDatabase<TABLES extends { [key: string]: any }> {
	public constructor (private pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>) {
	}

	public setPool (pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>) {
		this.pool = pool;
		return this;
	}

	public getTable<N extends Extract<keyof TABLES, string>> (name: N, pool = this.pool) {
		return new PostgresTable<TABLES[N]>(name, pool);
	}
}
