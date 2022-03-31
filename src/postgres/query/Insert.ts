import { Client, Pool, PoolClient, QueryResult } from "pg";
import { Row } from "../../base/DataType";
import Insert, { ColumnsToValues } from "../../base/query/Insert";
import Override from "../../decorator/Override";
import Overwrite from "../../type/Overwrite";
import PostgresTable from "../Table";

export default class PostgresInsert<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[], RETURN_COLUMNS extends (keyof SCHEMA)[] = []>
	extends Insert<SCHEMA, COLUMNS, number | Row<SCHEMA, RETURN_COLUMNS[number]>[] | Overwrite<QueryResult, { rows: Row<SCHEMA, RETURN_COLUMNS[number]>[] }>> {

	private valuesToAdd: ColumnsToValues<SCHEMA, COLUMNS, true>[] = [];
	private returnColumns: COLUMNS = [] as any;

	public constructor (private readonly table: PostgresTable<SCHEMA>, private readonly columns: COLUMNS) {
		super();
	}

	public values (...values: ColumnsToValues<SCHEMA, COLUMNS>): this;
	@Override public values (...values: any) {
		this.valuesToAdd.push(values);
		return this;
	}

	public returning<COLUMNS_NEW extends (keyof SCHEMA)[] | ["*"]> (...columns: COLUMNS_NEW): PostgresInsert<SCHEMA, COLUMNS, COLUMNS_NEW extends ["*"] ? (keyof SCHEMA)[] : COLUMNS_NEW> {
		this.returnColumns = columns as any;
		return this as any;
	}

	public async query (pool?: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>): Promise<RETURN_COLUMNS["length"] extends 0 ? number : Row<SCHEMA, RETURN_COLUMNS[number]>[]>;
	public async query (pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient> | undefined, resultObject: true): Promise<Overwrite<QueryResult, { rows: Row<SCHEMA, RETURN_COLUMNS[number]>[] }>>;
	@Override public async query (pool?: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>, resultObject?: boolean) {
		const results = await this.table.query(pool!, this.compile());

		if (resultObject) return results;
		return this.returnColumns.length ? results.rows : results.rowCount;
	}

	private compile () {
		let query = `INSERT INTO ${this.table.name}`;

		if (this.columns.length) query += ` (${this.columns.join(",")})`;

		const values: any[] = [];
		function registerValue (value?: string | number | null) {
			values.push(value);
			return `$${values.length}`;
		}

		if (!this.valuesToAdd.length) throw new Error("No data to insert");
		query += ` VALUES ${this.valuesToAdd.map(row => `(${row.map(registerValue).join(", ")})`).join(",")}`;

		if (this.returnColumns.length) query += ` RETURNING ${this.returnColumns.join(",")}`;

		return { query, values };
	}
}
