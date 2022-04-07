import { Client, Pool, PoolClient, QueryResult } from "pg";
import { Row } from "../../base/DataType";
import Insert, { ColumnsToValues } from "../../base/query/Insert";
import Overwrite from "../../type/Overwrite";
import PostgresTable from "../Table";
export default class PostgresInsert<SCHEMA extends {
    [key: string]: any;
}, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[], RETURN_COLUMNS extends (keyof SCHEMA)[] = []> extends Insert<SCHEMA, COLUMNS, number | Row<SCHEMA, RETURN_COLUMNS[number]>[] | Overwrite<QueryResult, {
    rows: Row<SCHEMA, RETURN_COLUMNS[number]>[];
}>> {
    private readonly table;
    private readonly columns;
    private valuesToAdd;
    private returnColumns;
    constructor(table: PostgresTable<SCHEMA>, columns: COLUMNS);
    values(...values: ColumnsToValues<SCHEMA, COLUMNS>): this;
    returning<COLUMNS_NEW extends (keyof SCHEMA)[] | ["*"]>(...columns: COLUMNS_NEW): PostgresInsert<SCHEMA, COLUMNS, COLUMNS_NEW extends ["*"] ? (keyof SCHEMA)[] : COLUMNS_NEW>;
    query(pool?: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>): Promise<RETURN_COLUMNS["length"] extends 0 ? number : Row<SCHEMA, RETURN_COLUMNS[number]>[]>;
    query(pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient> | undefined, resultObject: true): Promise<Overwrite<QueryResult, {
        rows: Row<SCHEMA, RETURN_COLUMNS[number]>[];
    }>>;
    private compile;
}
