import { DataType } from "./DataType";
import Insert from "./query/Insert";
import Select from "./query/Select";
import Update from "./query/Update";

export default abstract class Table<DATATYPE_NAMES extends Record<DataType, string>, SCHEMA extends { [key: string]: any; }, ALLOW_ZERO_COLUMN_SELECT extends boolean = false> {
	public constructor (public readonly name: string) { }

	public abstract select (all: "*"): Select<SCHEMA>;
	public abstract select<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS):
		ALLOW_ZERO_COLUMN_SELECT extends true ? Select<SCHEMA, COLUMNS> : COLUMNS["length"] extends 0 ? never : Select<SCHEMA, COLUMNS>;

	public abstract insert<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS): Insert<SCHEMA, COLUMNS, any>;

	public abstract update<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS): Update<DATATYPE_NAMES, SCHEMA, any>;

	public abstract async query (query: string | { query: string; values: any[] }): Promise<any>;
}
