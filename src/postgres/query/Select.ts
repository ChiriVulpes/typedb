// tslint:disable no-string-literal

import { Client, Pool, PoolClient, QueryResult } from "pg";
import { Row } from "../../base/DataType";
import { createExpressionBuilder, ExpressionBuilder } from "../../base/query/Expression";
import Select from "../../base/query/Select";
import Bound from "../../decorator/Bound";
import Override from "../../decorator/Override";
import Overwrite from "../../type/Overwrite";
import PostgresTable from "../Table";
import { PostgresExpression } from "./Expression";

export default class PostgresSelect<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> extends Select<SCHEMA, COLUMNS> {

	private readonly expression = new PostgresExpression<SCHEMA>(this.value);
	private readonly values: any[] = [];

	public constructor (private readonly table: PostgresTable<SCHEMA>, private readonly columns: "*" | COLUMNS) {
		super();
	}

	@Override public get where (): ExpressionBuilder<SCHEMA, this> {
		return createExpressionBuilder((options, column, operation, ...values) => {
			this.expression.createBuilder(options, column, operation, ...values);
			this.expression["tweakLastFilter"]((filter, previous) => previous && filter ? ` AND (${filter})` : filter);
			return this;
		});
	}

	public async query (pool?: Client | Pool | PoolClient): Promise<Row<SCHEMA, COLUMNS[number]>[]>;
	public async query (pool: Client | Pool | PoolClient | undefined, resultObject: true): Promise<Overwrite<QueryResult, { rows: Row<SCHEMA, COLUMNS[number]>[] }>>;
	@Override public async query (pool?: Client | Pool | PoolClient, resultObject?: boolean) {
		const results = await this.table.query(pool!, this.compile());

		if (resultObject) return results;
		return results.rows;
	}

	@Override public async queryOne (pool?: Client | Pool | PoolClient): Promise<Row<SCHEMA, COLUMNS[number]> | undefined> {
		const result = await this.limit(1).query(pool);
		return result[0];
	}

	private compile () {
		let query = `SELECT ${this.columns === "*" ? "*" : this.columns.join(",")} FROM ${this.table.name}`;

		const where = this.expression.compile();
		if (where)
			query += ` WHERE ${where}`;

		if (this.orderBy)
			query += ` ORDER BY ${this.orderBy["order"]
				.map(order => order.join(" "))
				.join(",")}`;

		if (typeof this.limitAmount === "number")
			query += ` LIMIT ${this.limitAmount}`;

		if (typeof this.offsetAmount === "number")
			query += ` OFFSET ${this.offsetAmount}`;

		return { query, values: this.values };
	}

	@Bound private value (value?: string | number | null | (string | number | null)[]) {
		this.values.push(value);
		return `$${this.values.length}`;
	}
}
