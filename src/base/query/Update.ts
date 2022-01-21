import Bound from "../../decorator/Bound";
import { DataTypeValue } from "../DataType";
import { ExpressionBuilder } from "./Expression";

export interface UpdateColumns<SCHEMA extends { [key: string]: any }> {
	column<COLUMN extends keyof SCHEMA> (column: COLUMN, value: DataTypeValue<SCHEMA[COLUMN]>): this;
	switch<COLUMN extends keyof SCHEMA> (column: COLUMN, cases: (swtch: UpdateSwitch<SCHEMA, COLUMN>) => any): this;
}

export interface UpdateSwitch<SCHEMA extends { [key: string]: any }, COLUMN extends keyof SCHEMA> {
	when: ExpressionBuilder<SCHEMA, UpdateSwitchThen<DataTypeValue<SCHEMA[COLUMN]>, this>>;
}

export interface UpdateSwitchThen<T, R> {
	then (value: T): R;
}

export default abstract class Update<SCHEMA extends { [key: string]: any }, RETURN>
	implements UpdateColumns<SCHEMA> {

	protected readonly columnUpdates: [keyof SCHEMA, any][] = [];

	public abstract get where (): ExpressionBuilder<SCHEMA, this>;

	@Bound public column<COLUMN extends keyof SCHEMA> (column: COLUMN, value: DataTypeValue<SCHEMA[COLUMN]>) {
		this.columnUpdates.push([column, value]);
		return this;
	}

	public columns (initializer: (update: UpdateColumns<SCHEMA>) => any) {
		initializer(this);
		return this;
	}

	public abstract switch<COLUMN extends keyof SCHEMA> (column: COLUMN, cases: (swtch: UpdateSwitch<SCHEMA, COLUMN>) => any): this;

	public abstract query (): Promise<RETURN>;
}
