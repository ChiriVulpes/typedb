import { Client, Pool, PoolClient, QueryResult } from "pg";
import { DataTypeName, DataTypeValue, Row } from "../../base/DataType";
import { ExpressionBuilder } from "../../base/query/Expression";
import Update, { UpdateSwitch, UpdateSwitchThen } from "../../base/query/Update";
import Overwrite from "../../type/Overwrite";
import { PostgresDataTypeNames } from "../DataType";
import PostgresTable from "../Table";
export default class PostgresUpdate<SCHEMA extends {
    [key: string]: any;
}, RETURN_COLUMNS extends (keyof SCHEMA)[] = []> extends Update<PostgresDataTypeNames, SCHEMA, number | Row<SCHEMA, RETURN_COLUMNS[number]>[] | Overwrite<QueryResult, {
    rows: Row<SCHEMA, RETURN_COLUMNS[number]>[];
}>> {
    private readonly table;
    private readonly expression;
    private readonly values;
    private returnColumns;
    constructor(table: PostgresTable<SCHEMA>);
    get where(): ExpressionBuilder<SCHEMA, this>;
    returning<COLUMNS_NEW extends (keyof SCHEMA)[] | ["*"]>(...columns: COLUMNS_NEW): PostgresUpdate<SCHEMA, COLUMNS_NEW extends ["*"] ? (keyof SCHEMA)[] : COLUMNS_NEW>;
    switch<COLUMN extends keyof SCHEMA>(column: COLUMN, type: DataTypeName<PostgresDataTypeNames, SCHEMA[COLUMN]>, initializer: (swtch: UpdateSwitch<SCHEMA, COLUMN>) => any): this;
    query(pool?: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>): Promise<RETURN_COLUMNS["length"] extends 0 ? number : Row<SCHEMA, RETURN_COLUMNS[number]>[]>;
    query(pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient> | undefined, resultObject: true): Promise<Overwrite<QueryResult, {
        rows: Row<SCHEMA, RETURN_COLUMNS[number]>[];
    }>>;
    private compile;
    private value;
}
export declare class PostgresUpdateSwitch<SCHEMA extends {
    [key: string]: any;
}, COLUMN extends keyof SCHEMA> implements UpdateSwitch<SCHEMA, COLUMN> {
    private readonly values;
    private readonly type;
    private cases;
    private elseValue?;
    constructor(values: any[], type: DataTypeName<PostgresDataTypeNames, SCHEMA[COLUMN]>);
    get when(): ExpressionBuilder<SCHEMA, UpdateSwitchThen<DataTypeValue<SCHEMA[COLUMN]>, this>>;
    else(value: DataTypeValue<SCHEMA[COLUMN]>): this;
    private compile;
    private value;
}
