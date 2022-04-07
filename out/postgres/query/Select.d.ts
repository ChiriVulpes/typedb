import { Client, Pool, PoolClient, QueryResult } from "pg";
import { Row } from "../../base/DataType";
import { ExpressionBuilder } from "../../base/query/Expression";
import Select from "../../base/query/Select";
import Overwrite from "../../type/Overwrite";
import PostgresTable from "../Table";
export default class PostgresSelect<SCHEMA extends {
    [key: string]: any;
}, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> extends Select<SCHEMA, COLUMNS> {
    private readonly table;
    private readonly columns;
    private readonly expression;
    private readonly values;
    constructor(table: PostgresTable<SCHEMA>, columns: "*" | COLUMNS);
    get where(): ExpressionBuilder<SCHEMA, this>;
    query(pool?: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>): Promise<Row<SCHEMA, COLUMNS[number]>[]>;
    query(pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient> | undefined, resultObject: true): Promise<Overwrite<QueryResult, {
        rows: Row<SCHEMA, COLUMNS[number]>[];
    }>>;
    queryOne(pool?: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>): Promise<Row<SCHEMA, COLUMNS[number]> | undefined>;
    private compile;
    private value;
}
