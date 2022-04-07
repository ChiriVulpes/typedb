import { DataType } from "./DataType";
import Table from "./Table";

export default abstract class Database<DATATYPE_NAMES extends Record<DataType, string>, TABLES extends { [key: string]: any }> {
	public constructor () { }

	public abstract getTable<N extends Extract<keyof TABLES, string>> (name: N): Table<DATATYPE_NAMES, TABLES[N]>;
}
