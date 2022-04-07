import { DataType, DataTypeName, DataTypeValue } from "../DataType";
import { ExpressionBuilder } from "./Expression";
export interface UpdateColumns<DATATYPE_NAMES extends Record<DataType, string>, SCHEMA extends {
    [key: string]: any;
}> {
    column<COLUMN extends keyof SCHEMA>(column: COLUMN, value: DataTypeValue<SCHEMA[COLUMN]>): this;
    switch<COLUMN extends keyof SCHEMA>(column: COLUMN, type: DataTypeName<DATATYPE_NAMES, SCHEMA[COLUMN]>, cases: (swtch: UpdateSwitch<SCHEMA, COLUMN>) => any): this;
}
export interface UpdateSwitch<SCHEMA extends {
    [key: string]: any;
}, COLUMN extends keyof SCHEMA> {
    when: ExpressionBuilder<SCHEMA, UpdateSwitchThen<DataTypeValue<SCHEMA[COLUMN]>, this>>;
    else(value: DataTypeValue<SCHEMA[COLUMN]>): this;
}
export interface UpdateSwitchThen<T, R> {
    then(value: T): R;
}
export default abstract class Update<DATATYPE_NAMES extends Record<DataType, string>, SCHEMA extends {
    [key: string]: any;
}, RETURN> implements UpdateColumns<DATATYPE_NAMES, SCHEMA> {
    protected readonly columnUpdates: [keyof SCHEMA, any][];
    abstract get where(): ExpressionBuilder<SCHEMA, this>;
    column<COLUMN extends keyof SCHEMA>(column: COLUMN, value: DataTypeValue<SCHEMA[COLUMN]>): this;
    columns(initializer: (update: UpdateColumns<DATATYPE_NAMES, SCHEMA>) => any): this;
    abstract switch<COLUMN extends keyof SCHEMA>(column: COLUMN, type: DataTypeName<DATATYPE_NAMES, SCHEMA[COLUMN]>, cases: (swtch: UpdateSwitch<SCHEMA, COLUMN>) => any): this;
    abstract query(): Promise<RETURN>;
}
