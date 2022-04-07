import { DataTypeValue } from "../DataType";
export declare type ColumnsToValues<SCHEMA extends {
    [key: string]: any;
}, COLUMNS extends any[], ALLOW_EXPRESSIONS extends boolean = false> = {
    [index in keyof COLUMNS]: DataTypeValue<SCHEMA[Extract<COLUMNS[index], keyof SCHEMA>]>;
};
export default abstract class Insert<SCHEMA extends {
    [key: string]: any;
}, COLUMNS extends (keyof SCHEMA)[], RETURN> {
    abstract values(...values: ColumnsToValues<SCHEMA, COLUMNS>): this;
    abstract query(): Promise<RETURN>;
}
