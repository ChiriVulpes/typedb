import { Row } from "../DataType";
import { ExpressionBuilder } from "./Expression";
export default abstract class Select<SCHEMA extends {
    [key: string]: any;
}, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> {
    protected limitAmount?: number;
    protected offsetAmount?: number;
    protected orderBy?: OrderBy<COLUMNS[number]>;
    abstract get where(): ExpressionBuilder<SCHEMA, this>;
    limit(amt: number): this;
    offset(amt: number): this;
    /**
     * @param column The column to order by
     * @param direction The direction, ascending or descending. Defaults to ascending.
     */
    order(column: COLUMNS[number], direction?: "asc" | "desc"): this;
    /**
     * @param orderer A function that will apply a list of columns and directions to order by.
     *
     * Example:
     * ```ts
     * .order(by => by("firstName")
     * 	.then("lastName", "desc"))
     * ```
     */
    order(orderer: (by: OrderBy<COLUMNS[number]>["then"]) => any): this;
    abstract query(): Promise<Row<SCHEMA, COLUMNS[number]>[]>;
    abstract queryOne(): Promise<Row<SCHEMA, COLUMNS[number]> | undefined>;
}
declare class OrderBy<COLUMN extends string | number | symbol = string | number | symbol> {
    protected order: [COLUMN, ("asc" | "desc")?][];
    /**
     * @param column The column to order by
     * @param direction The direction, ascending or descending. Defaults to ascending.
     */
    then(column: COLUMN, direction?: "asc" | "desc"): this;
}
export {};
