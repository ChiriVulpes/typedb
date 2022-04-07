import { Client, Pool, PoolClient, QueryResult } from "pg";
import { DataTypeName, DataTypeValue } from "../../base/DataType";
import Delete from "../../base/query/Delete";
import { createExpressionBuilder, ExpressionBuilder } from "../../base/query/Expression";
import { UpdateSwitch, UpdateSwitchThen } from "../../base/query/Update";
import Bound from "../../decorator/Bound";
import Override from "../../decorator/Override";
import { PostgresDataTypeNames } from "../DataType";
import PostgresTable from "../Table";
import { PostgresExpression } from "./Expression";

export default class PostgresDelete<SCHEMA extends { [key: string]: any }>
	extends Delete<SCHEMA, QueryResult> {

	private readonly expression = new PostgresExpression<SCHEMA>(this.value);
	private readonly values: any[] = [];

	public constructor (private readonly table: PostgresTable<SCHEMA>) {
		super();
	}

	@Override public get where (): ExpressionBuilder<SCHEMA, this> {
		return createExpressionBuilder((options, column, operation, ...values) => {
			this.expression.createBuilder(options, column, operation, ...values);
			return this;
		});
	}

	@Override public async query (pool?: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>) {
		return await this.table.query(pool!, this.compile());
	}

	private compile () {
		let query = `DELETE FROM ${this.table.name}`;

		const where = this.expression.compile();
		if (where) query += ` WHERE ${where}`;

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
	public constructor (private readonly values: any[], private readonly type: DataTypeName<PostgresDataTypeNames, SCHEMA[COLUMN]>) { }

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
		let query = `(CASE `;

		const cases = this.cases.map(([expression, value]) => [expression.compile(), value] as const)
			.filter(([expression]) => expression);

		if (!cases.length) throw new Error("No cases for update");
		query += cases.map(([expression, value]) => `WHEN ${expression} THEN ${this.value(value)}`).join(" ");

		if (this.elseValue !== undefined)
			query += ` ELSE ${this.value(this.elseValue)}`;

		return query + " END)" + (this.type ? `::${this.type}` : "");
	}

	@Bound private value (value?: string | number | null | (string | number | null)[]) {
		this.values.push(value);
		return `$${this.values.length}`;
	}
}
