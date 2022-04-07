"use strict";
// import { Connection, FieldInfo, PoolConnection } from "mysql";
// import Table from "../base/Table";
// import Override from "../decorator/Override";
// import MySQLInsert from "./query/Insert";
// import MySQLSelect from "./query/Select";
// import MySQLUpdate from "./query/Update";
// export default class MySQLTable<SCHEMA extends { [key: string]: any; }> extends Table<SCHEMA> {
// 	public constructor (public readonly name: string, private readonly pool: Connection | PoolConnection) {
// 		super(name);
// 	}
// 	@Override public insert<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS) {
// 		return new MySQLInsert<SCHEMA, COLUMNS>(this, columns);
// 	}
// 	public select (all: "*"): MySQLSelect<SCHEMA>;
// 	public select<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS): COLUMNS["length"] extends 0 ? never : MySQLSelect<SCHEMA, COLUMNS>;
// 	@Override public select (...columns: string[]) {
// 		return new MySQLSelect(this, columns as (keyof SCHEMA)[]);
// 	}
// 	@Override public update () {
// 		return new MySQLUpdate<SCHEMA>(this);
// 	}
// 	public async query (query: string | { query: string; values: any[] }): Promise<any[]>;
// 	public async query (query: string | { query: string; values: any[] }, fields: true): Promise<{ results: any[], fields: FieldInfo[] }>;
// 	@Override public async query (query: string | { query: string; values: any[] }, includeFields = false) {
// 		let values: any[] = [];
// 		if (typeof query === "object") {
// 			values = query.values;
// 			query = query.query;
// 		}
// 		console.log(query, values);
// 		return new Promise((resolve, reject) => this.pool.query(query as string, values, (err, results, fields) => {
// 			if (err) reject(err);
// 			if (includeFields) resolve({ results, fields });
// 			else resolve(results);
// 		}));
// 	}
// }
