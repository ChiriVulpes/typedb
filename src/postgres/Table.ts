import { Client, Pool, PoolClient, QueryResult } from "pg";
import Table from "../base/Table";
import Override from "../decorator/Override";
import { PostgresDataTypeNames } from "./DataType";
import PostgresInsert from "./query/Insert";
import PostgresSelect from "./query/Select";
import PostgresUpdate from "./query/Update";

export default class PostgresTable<SCHEMA extends { [key: string]: any; }> extends Table<PostgresDataTypeNames, SCHEMA, true> {
	public constructor (public readonly name: string, private readonly pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>) {
		super(name);
	}

	public select (all: "*"): PostgresSelect<SCHEMA>;
	public select<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS): PostgresSelect<SCHEMA, COLUMNS>;
	@Override public select (...columns: string[]) {
		return new PostgresSelect(this, columns as (keyof SCHEMA)[]);
	}

	/**
	 * Note: Unlike with plain SQL, you *must* specify the columns you will modify.
	 * This is because the parameters in `values` calls can't be strictly typed unless the column order is known, and it's not.
	 */
	@Override public insert<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS): COLUMNS["length"] extends 0 ? never : PostgresInsert<SCHEMA, COLUMNS> {
		return new PostgresInsert<SCHEMA, COLUMNS>(this, columns) as never;
	}

	@Override public update () {
		return new PostgresUpdate<SCHEMA>(this);
	}

	public async query (query: string | { query: string; values: any[] }): Promise<QueryResult>;
	public async query (pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>, query: string | { query: string; values: any[] }): Promise<QueryResult>;
	@Override public async query (pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient> | string | { query: string; values: any[] }, query?: string | { query: string; values: any[] }) {
		if (pool && !(pool instanceof Promise) && (typeof pool !== "object" || {}.constructor === pool.constructor)) {
			query = pool as string | { query: string; values: any[] };
			pool = this.pool;
		}

		if (pool instanceof Promise)
			pool = await pool;

		let values: any[] = [];
		if (typeof query === "object") {
			values = query.values;
			query = query.query;
		}

		console.log(query, values);

		return new Promise<QueryResult>((resolve, reject) => (pool as Client | Pool | PoolClient || this.pool).query({ text: query as string, values }, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		}));
	}
}
