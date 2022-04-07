// tslint:disable no-string-literal

import Bound from "../../decorator/Bound";
import { Row } from "../DataType";
import { ExpressionBuilder } from "./Expression";

export default abstract class Select<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> {

	protected limitAmount?: number;
	protected offsetAmount?: number;
	protected orderBy?: OrderBy<COLUMNS[number]>;

	public abstract get where (): ExpressionBuilder<SCHEMA, this>;

	public limit (amt: number) {
		this.limitAmount = amt;
		return this;
	}

	public offset (amt: number) {
		this.offsetAmount = amt;
		return this;
	}

	/**
	 * @param column The column to order by
	 * @param direction The direction, ascending or descending. Defaults to ascending.
	 */
	public order (column: COLUMNS[number], direction?: "asc" | "desc"): this;
	/**
	 * @param orderer A function that will apply a list of columns and directions to order by.
	 *
	 * Example:
	 * ```ts
	 * .order(by => by("firstName")
	 * 	.then("lastName", "desc"))
	 * ```
	 */
	public order (orderer: (by: OrderBy<COLUMNS[number]>["then"]) => any): this;
	public order (orderer: ((by: OrderBy<COLUMNS[number]>["then"]) => any) | COLUMNS[number], direction?: "asc" | "desc") {
		this.orderBy = new OrderBy();

		if (typeof orderer === "function")
			orderer(this.orderBy.then);
		else
			this.orderBy.then(orderer, direction);

		return this;
	}

	public abstract query (): Promise<Row<SCHEMA, COLUMNS[number]>[]>;
	public abstract queryOne (): Promise<Row<SCHEMA, COLUMNS[number]> | undefined>;
}

class OrderBy<COLUMN extends string | number | symbol = string | number | symbol> {
	protected order: [COLUMN, ("asc" | "desc")?][] = [];

	/**
	 * @param column The column to order by
	 * @param direction The direction, ascending or descending. Defaults to ascending.
	 */
	public then (column: COLUMN, direction?: "asc" | "desc"): this;
	@Bound public then (...args: [COLUMN, ("asc" | "desc")?]) {
		this.order.push(args);
		return this;
	}
}

