import { Client, Pool, PoolClient, QueryResult } from "pg";
import Table from "../base/Table";
import Override from "../decorator/Override";
import Overwrite from "../type/Overwrite";
import { PostgresDataTypeNames } from "./DataType";
import PostgresDelete from "./query/Delete";
import PostgresInsert from "./query/Insert";
import QueryParametersProvider from "./query/QueryParametersProvider";
import PostgresSelect from "./query/Select";
import PostgresUpdate from "./query/Update";

let ansicolor: typeof import("ansicolor") | undefined;
function color (color: keyof typeof import("ansicolor"), text: string) {
	if (!ansicolor) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			ansicolor = require("ansicolor");
			// eslint-disable-next-line no-empty
		} catch { }

		if (!ansicolor)
			return text;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	return (ansicolor as any)[color](text) as string;
}

export type Query = string | { query: string; values: any[] } | ((parameters: QueryParametersProvider) => string);

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

	@Override public delete () {
		return new PostgresDelete<SCHEMA>(this);
	}

	public async query (query: Query): Promise<QueryResult>;
	public async query (pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient> | undefined, query: Query): Promise<QueryResult>;
	public async query<ROW> (query: Query): Promise<Overwrite<QueryResult, { rows: ROW[] }>>;
	public async query<ROW> (pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient> | undefined, query: Query): Promise<Overwrite<QueryResult, { rows: ROW[] }>>;
	@Override public async query (pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient> | undefined | Query, query?: Query) {
		if (pool && !(pool instanceof Promise) && (typeof pool !== "object" || {}.constructor === pool.constructor)) {
			query = pool as string | { query: string; values: any[] };
			pool = this.pool;
		}

		if (pool instanceof Promise)
			pool = await pool;

		if (typeof query === "function") {
			const parametersProvider = new QueryParametersProvider();
			query = {
				query: query(parametersProvider).replace(/[ \t]+/g, " ").replace(/\n\s+/g, "\n").trim(),
				values: parametersProvider.getValues(),
			};
		}

		let values: any[] = [];
		if (typeof query === "object") {
			values = query.values;
			query = query.query;
		}

		const valuesStr = values
			.map(value => {
				switch (typeof value) {
					case "bigint": case "number":
						return color("green", `${value}`);
					case "string":
						return color("lightCyan", `"${value}"`);
					default:
						return color("lightGray", `${JSON.stringify(value)}`);
				}
			})
			.map((valueStr, i) => `${color("darkGray", `$${i + 1}:`)} ${valueStr}`)
			.join(color("darkGray", ", "));
		if (valuesStr.length >= 50)
			this.log(`  ${valuesStr}`);
		this.log(`  ${valuesStr.length < 50 ? `${valuesStr} ` : "  "}>`, color("darkGray", query!));

		return new Promise<QueryResult>((resolve, reject) => (pool as Client | Pool | PoolClient || this.pool).query({ text: query as string, values }, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		}));
	}

	private log (text: string): void;
	private log (prefix: string, text: string): void;
	private log (prefix: string, text?: string) {
		if (!process.env.DEBUG_PG)
			return;

		if (text === undefined)
			text = prefix, prefix = "";

		prefix = prefix ? prefix.slice(0, 50).trimEnd() + " " : prefix; // cap prefix length at 50

		const maxLineLength = 250 - prefix.length;
		text = text.split("\n")
			.flatMap(line => {
				const lines = [];
				while (line.length > maxLineLength) {
					lines.push(line.slice(0, maxLineLength));
					line = line.slice(maxLineLength);
				}
				lines.push(line.trimEnd());
				return lines;
			})
			.filter(line => line)
			.map((line, i) => i ? line.padStart(line.length + prefix.length, " ") : `${prefix}${line}`)
			.join("\n");

		console.log(text);
	}
}
