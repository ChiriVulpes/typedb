"use strict";
// import { Connection, PoolConnection } from "mysql";
// import MySQLTable from "./Table";
// export default class MySQLDatabase<TABLES extends { [key: string]: any }> {
// 	public constructor (private pool: Connection | PoolConnection) {
// 	}
// 	public setPool (pool: Connection | PoolConnection) {
// 		this.pool = pool;
// 		return this;
// 	}
// 	public getTable<N extends Extract<keyof TABLES, string>> (name: N, pool = this.pool) {
// 		return new MySQLTable<TABLES[N]>(name, pool);
// 	}
// }
