"use strict";
// import Insert, { ColumnsToValues } from "../../base/query/Insert";
// import Override from "../../decorator/Override";
// import MySQLTable from "../Table";
// export default class MySQLInsert<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> extends Insert<SCHEMA, COLUMNS, any> {
// 	private valuesToAdd: ColumnsToValues<SCHEMA, COLUMNS, true>[] = [];
// 	// @ts-ignore
// 	public constructor (private readonly table: MySQLTable<SCHEMA>, private readonly columns: COLUMNS) { }
// 	public values (...values: ColumnsToValues<SCHEMA, COLUMNS>): this;
// 	@Override public values (...values: any) {
// 		this.valuesToAdd.push(values);
// 		return this;
// 	}
// 	@Override public async query (): Promise<never> {
// 		throw new Error("Unimplemented");
// 	}
// }
