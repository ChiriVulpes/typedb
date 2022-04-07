"use strict";
// import { Row } from "../../base/DataType";
// import { createExpressionBuilder, ExpressionBuilder, ExpressionBuilderFunction } from "../../base/query/Expression";
// import Select from "../../base/query/Select";
// import Bound from "../../decorator/Bound";
// import Override from "../../decorator/Override";
// import MySQLTable from "../Table";
// import { MySQLExpression } from "./Expression";
// export default class MySQLSelect<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> extends Select<SCHEMA, COLUMNS> {
// 	private readonly expression = new MySQLExpression<SCHEMA>(this.value);
// 	private readonly values: any[] = [];
// 	public constructor (private readonly table: MySQLTable<SCHEMA>, private readonly columns: "*" | COLUMNS) {
// 		super();
// 	}
// 	@Override public get where (): ExpressionBuilder<SCHEMA, this> {
// 		return createExpressionBuilder((column, operation, value, value2, not) => {
// 			(this.expression.is as ExpressionBuilderFunction<any, SCHEMA>)(column, operation, value, value2, not);
// 			return this;
// 		});
// 	}
// 	@Override public async query (): Promise<Row<SCHEMA, COLUMNS[number]>[]> {
// 		return this.table.query(this.compile()) as any;
// 	}
// 	@Override public async queryOne (): Promise<Row<SCHEMA, COLUMNS[number]> | undefined> {
// 		const result = await this.limit(1).query();
// 		return result[0];
// 	}
// 	private compile () {
// 		let query = `SELECT ${this.columns === "*" ? "*" : this.columns.join(",")} FROM ${this.table.name}`;
// 		const where = this.expression.compile();
// 		if (where) query += ` WHERE ${where}`;
// 		if (typeof this.limitAmount === "number") query += ` LIMIT ${this.limitAmount}`;
// 		return { query, values: this.values };
// 	}
// 	@Bound private value (value?: string | number | null): "?" {
// 		this.values.push(value);
// 		return "?";
// 	}
// }
