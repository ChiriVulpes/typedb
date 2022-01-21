import { Client, Pool, PoolClient, QueryResult } from "pg";
import { DataTypeValue, Row } from "../../base/DataType";
import { createExpressionBuilder, ExpressionBuilder } from "../../base/query/Expression";
import Update, { UpdateSwitch, UpdateSwitchThen } from "../../base/query/Update";
import Bound from "../../decorator/Bound";
import Override from "../../decorator/Override";
import Overwrite from "../../type/Overwrite";
import PostgresTable from "../Table";
import { PostgresExpression } from "./Expression";

export default class PostgresUpdate<SCHEMA extends { [key: string]: any }, RETURN_COLUMNS extends (keyof SCHEMA)[] = []>
	extends Update<SCHEMA, number | Row<SCHEMA, RETURN_COLUMNS[number]>[] | Overwrite<QueryResult, { rows: Row<SCHEMA, RETURN_COLUMNS[number]>[] }>> {

	private readonly expression = new PostgresExpression<SCHEMA>(this.value);
	private readonly values: any[] = [];
	private returnColumns: RETURN_COLUMNS = [] as any;

	public constructor (private readonly table: PostgresTable<SCHEMA>) {
		super();
	}

	@Override public get where (): ExpressionBuilder<SCHEMA, this> {
		return createExpressionBuilder((options, column, operation, ...values) => {
			this.expression.createBuilder(options, column, operation, ...values);
			return this;
		});
	}

	public returning<COLUMNS_NEW extends (keyof SCHEMA)[] | ["*"]> (...columns: COLUMNS_NEW): PostgresUpdate<SCHEMA, COLUMNS_NEW extends ["*"] ? (keyof SCHEMA)[] : COLUMNS_NEW> {
		this.returnColumns = columns as any;
		return this as any;
	}

	@Override @Bound public switch<COLUMN extends keyof SCHEMA> (column: COLUMN, initializer: (swtch: UpdateSwitch<SCHEMA, COLUMN>) => any) {
		const swtch = new PostgresUpdateSwitch<SCHEMA, COLUMN>(this.values);
		initializer(swtch);
		this.columnUpdates.push([column, swtch]);
		return this;
	}

	public async query (pool?: Client | Pool | PoolClient): Promise<RETURN_COLUMNS["length"] extends 0 ? number : Row<SCHEMA, RETURN_COLUMNS[number]>[]>;
	public async query (pool: Client | Pool | PoolClient | undefined, resultObject: true): Promise<Overwrite<QueryResult, { rows: Row<SCHEMA, RETURN_COLUMNS[number]>[] }>>;
	@Override public async query (pool?: Client | Pool | PoolClient, resultObject?: boolean) {
		const results = await this.table.query(pool!, this.compile());

		if (resultObject) return results;
		return this.returnColumns.length ? results.rows : results.rowCount;
	}

	private compile () {
		let query = `UPDATE ${this.table.name}`;

		if (!this.columnUpdates.length) throw new Error("No columns to update");
		query += ` SET ${this.columnUpdates.map(([column, value]) => `${column} = ${value instanceof PostgresUpdateSwitch ? value["compile"]() : this.value(value)}`).join(", ")}`;

		const where = this.expression.compile();
		if (where) query += ` WHERE ${where}`;

		if (this.returnColumns.length) query += ` RETURNING ${this.returnColumns.join(",")}`;

		return { query, values: this.values };
	}

	@Bound private value (value?: string | number | null | (string | number | null)[]) {
		this.values.push(value);
		return `$${this.values.length}`;
	}
}

export class PostgresUpdateSwitch<SCHEMA extends { [key: string]: any }, COLUMN extends keyof SCHEMA> implements UpdateSwitch<SCHEMA, COLUMN> {

	private cases: [PostgresExpression<SCHEMA>, any][] = [];
	private elseValue?: DataTypeValue<SCHEMA[COLUMN]>;
	public constructor (private values: any[]) { }

	public get when (): ExpressionBuilder<SCHEMA, UpdateSwitchThen<DataTypeValue<SCHEMA[COLUMN]>, this>> {
		return createExpressionBuilder((options, column, operation, ...values) => {
			const expression = new PostgresExpression<SCHEMA>(this.value);
			expression.createBuilder(options, column, operation, ...values);
			return {
				then: value => {
					this.cases.push([expression, value]);
					return this;
				},
			};
		});
	}

	public else (value: DataTypeValue<SCHEMA[COLUMN]>) {
		this.elseValue = value;
		return this;
	}

	// @ts-ignore
	private compile () {
		let query = `CASE `;

		const cases = this.cases.map(([expression, value]) => [expression.compile(), value] as const)
			.filter(([expression]) => expression);

		if (!cases.length) throw new Error("No cases for update");
		query += cases.map(([expression, value]) => `WHEN ${expression} THEN ${this.value(value)}`).join(" ");

		if (this.elseValue !== undefined)
			query += ` ELSE ${this.value(this.elseValue)}`;

		return query + " END";
	}

	@Bound private value (value?: string | number | null | (string | number | null)[]) {
		this.values.push(value);
		return `$${this.values.length}`;
	}
}
