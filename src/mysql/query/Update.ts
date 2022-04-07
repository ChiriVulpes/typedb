// import { createExpressionBuilder, ExpressionBuilder, ExpressionBuilderFunction } from "../../base/query/Expression";
// import Update from "../../base/query/Update";
// import Bound from "../../decorator/Bound";
// import Override from "../../decorator/Override";
// import MySQLTable from "../Table";
// import { MySQLExpression } from "./Expression";

// export default class MySQLUpdate<SCHEMA extends { [key: string]: any }> extends Update<SCHEMA, number> {

// 	private readonly expression = new MySQLExpression<SCHEMA>(this.value);
// 	private readonly values: any[] = [];

// 	public constructor (private readonly table: MySQLTable<SCHEMA>) {
// 		super();
// 	}

// 	@Override public get where (): ExpressionBuilder<SCHEMA, this> {
// 		return createExpressionBuilder((column, operation, value, value2, not) => {
// 			this.expression[""](column, operation, value, value2, not);
// 			return this;
// 		});
// 	}

// 	@Override public async query () {
// 		return this.table.query(this.compile()) as any;
// 	}

// 	private compile () {
// 		let query = `UPDATE ${this.table.name}`;

// 		if (!this.columnUpdates.length) throw new Error("No columns to update");
// 		query += ` SET ${this.columnUpdates.map(([column, value]) => `${column} = ${this.value(value)}`).join(", ")}`;

// 		const where = this.expression.compile();
// 		if (where) query += ` WHERE ${where}`;

// 		return { query, values: this.values };
// 	}

// 	@Bound private value (value?: string | number | null): "?" {
// 		this.values.push(value);
// 		return "?";
// 	}
// }
