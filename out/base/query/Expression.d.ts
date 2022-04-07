import { DataTypeArrayValue, DataTypeValue } from "../DataType";
import { Operations } from "../Operations";
export declare abstract class Expression<SCHEMA extends {
    [key: string]: any;
}> {
    protected lastFilterEditable: boolean;
    private readonly filters;
    abstract get is(): ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>;
    compile(): string;
    protected tweakLastFilter(tweaker: (filter: string, previousFilter?: string | (() => string)) => string): void;
    protected addFilter(filter: string | (() => string)): void;
}
export declare abstract class ExpressionAndOr<SCHEMA extends {
    [key: string]: any;
}> {
    abstract get and(): ExpressionBuilder<SCHEMA, this>;
    abstract get or(): ExpressionBuilder<SCHEMA, this>;
}
declare type ColumnOperations<SCHEMA extends {
    [key: string]: any;
}, KEY extends keyof SCHEMA> = Operations<SCHEMA[KEY]> | "==" | "!=";
export interface ExpressionBuilder<SCHEMA extends {
    [key: string]: any;
}, RETURN> extends ExpressionBuilderExtensions<SCHEMA, RETURN> {
    (initializer: (expr: ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>) => any): RETURN;
    <KEY extends keyof SCHEMA, OPERATION extends ColumnOperations<SCHEMA, KEY>>(column: KEY, operation: OPERATION, ...args: ExpressionBuilderArguments<SCHEMA, KEY, OPERATION>): RETURN;
}
interface ExpressionBuilderExtensions<SCHEMA extends {
    [key: string]: any;
}, RETURN> {
    not: ExpressionBuilder<SCHEMA, RETURN>;
    if<KEY extends keyof SCHEMA, OPERATION extends ColumnOperations<SCHEMA, KEY>>(condition: any, column: KEY, operation: OPERATION, ...args: ExpressionBuilderArguments<SCHEMA, KEY, OPERATION>): RETURN;
}
declare type ExpressionBuilderArguments<SCHEMA extends {
    [key: string]: any;
}, KEY extends keyof SCHEMA, OPERATION extends ColumnOperations<SCHEMA, KEY>> = OPERATION extends "==" | "!=" ? [null | (OPERATION extends Operations<SCHEMA[KEY]> ? DataTypeValue<SCHEMA[KEY]> : never)] : OPERATION extends "BETWEEN" ? [DataTypeValue<SCHEMA[KEY]>, DataTypeValue<SCHEMA[KEY]>] : OPERATION extends "CONTAINS" ? DataTypeArrayValue<SCHEMA[KEY]>[] : OPERATION extends "IN" ? [DataTypeValue<SCHEMA[KEY]>[]] : OPERATION extends Operations<SCHEMA[KEY]> ? [DataTypeValue<SCHEMA[KEY]>] : never;
export interface ExpressionBuilderOptions {
    not?: boolean;
    condition?: any;
}
export declare type ExpressionBuilderFunction<RETURN, SCHEMA extends {
    [key: string]: any;
}> = (options: ExpressionBuilderOptions, column: string | ((expr: ExpressionBuilder<SCHEMA, any>) => any), operation?: string, ...values: (string | number | null)[]) => RETURN;
export declare function createExpressionBuilder<RETURN, SCHEMA extends {
    [key: string]: any;
}>(builder: ExpressionBuilderFunction<RETURN, SCHEMA>, ...excludedProperties: (keyof ExpressionBuilderExtensions<SCHEMA, RETURN>)[]): ExpressionBuilder<SCHEMA, RETURN>;
export {};
