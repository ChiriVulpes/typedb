import { Client, Pool, PoolClient, QueryResult } from "pg";
import { DataTypeName, DataTypeValue } from "../../base/DataType";
import Delete from "../../base/query/Delete";
import { ExpressionBuilder } from "../../base/query/Expression";
import { UpdateSwitch, UpdateSwitchThen } from "../../base/query/Update";
import { PostgresDataTypeNames } from "../DataType";
import PostgresTable from "../Table";
export default class PostgresDelete<SCHEMA extends {
    [key: string]: any;
}> extends Delete<SCHEMA, QueryResult> {
    private readonly table;
    private readonly expression;
    private readonly values;
    constructor(table: PostgresTable<SCHEMA>);
    get where(): ExpressionBuilder<SCHEMA, this>;
    query(pool?: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>): Promise<QueryResult>;
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
