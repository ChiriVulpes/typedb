import { Client, Pool, PoolClient, QueryResult } from "pg";
import Table from "../base/Table";
import Overwrite from "../type/Overwrite";
import { PostgresDataTypeNames } from "./DataType";
import PostgresDelete from "./query/Delete";
import PostgresInsert from "./query/Insert";
import QueryParametersProvider from "./query/QueryParametersProvider";
import PostgresSelect from "./query/Select";
import PostgresUpdate from "./query/Update";
export declare type Query = string | {
    query: string;
    values: any[];
} | ((parameters: QueryParametersProvider) => string);
export default class PostgresTable<SCHEMA extends {
    [key: string]: any;
}> extends Table<PostgresDataTypeNames, SCHEMA, true> {
    readonly name: string;
    private readonly pool;
    constructor(name: string, pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient>);
    select(all: "*"): PostgresSelect<SCHEMA>;
    select<COLUMNS extends (keyof SCHEMA)[]>(...columns: COLUMNS): PostgresSelect<SCHEMA, COLUMNS>;
    /**
     * Note: Unlike with plain SQL, you *must* specify the columns you will modify.
     * This is because the parameters in `values` calls can't be strictly typed unless the column order is known, and it's not.
     */
    insert<COLUMNS extends (keyof SCHEMA)[]>(...columns: COLUMNS): COLUMNS["length"] extends 0 ? never : PostgresInsert<SCHEMA, COLUMNS>;
    update(): PostgresUpdate<SCHEMA, []>;
    delete(): PostgresDelete<SCHEMA>;
    query(query: Query): Promise<QueryResult>;
    query(pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient> | undefined, query: Query): Promise<QueryResult>;
    query<ROW>(query: Query): Promise<Overwrite<QueryResult, {
        rows: ROW[];
    }>>;
    query<ROW>(pool: Client | Pool | PoolClient | Promise<Client | Pool | PoolClient> | undefined, query: Query): Promise<Overwrite<QueryResult, {
        rows: ROW[];
    }>>;
    private log;
}
