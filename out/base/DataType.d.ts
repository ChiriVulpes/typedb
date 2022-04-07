export declare enum DataType {
    INTEGER = 0,
    INT = 1,
    SMALLINT = 2,
    TINYINT = 3,
    MEDIUMINT = 4,
    BIGINT = 5,
    DECIMAL = 6,
    NUMERIC = 7,
    FLOAT = 8,
    DOUBLE = 9,
    BIT = 10,
    DATE = 11,
    DATETIME = 12,
    TIMESTAMP = 13,
    TIME = 14,
    YEAR = 15,
    CHAR = 16,
    VARCHAR = 17,
    BINARY = 18,
    VARBINARY = 19,
    BLOB = 20,
    TEXT = 21,
    NULL = 22,
    TSVECTOR = 23
}
export declare type DataTypeValue<DATATYPE> = DATATYPE extends string ? DATATYPE : DATATYPE extends string[] ? DATATYPE : DATATYPE extends DataType[] ? DataTypeValueInternal<DATATYPE extends (infer D)[] ? Extract<D, DataType> : never>[] : DATATYPE extends DataType ? DataTypeValueInternal<DATATYPE> : never;
export declare type DataTypeArrayValue<DATATYPE> = DATATYPE extends DataType[] ? DataTypeValueInternal<DATATYPE extends (infer D)[] ? Extract<D, DataType> : never> : DataTypeValue<DATATYPE>;
declare type DataTypeValueInternal<DATATYPE extends DataType> = {
    [DataType.INTEGER]: number;
    [DataType.INT]: number;
    [DataType.SMALLINT]: number;
    [DataType.TINYINT]: number;
    [DataType.MEDIUMINT]: number;
    [DataType.BIGINT]: number | bigint;
    [DataType.DECIMAL]: number;
    [DataType.NUMERIC]: number;
    [DataType.FLOAT]: number;
    [DataType.DOUBLE]: number;
    [DataType.BIT]: number;
    [DataType.DATE]: number;
    [DataType.DATETIME]: number;
    [DataType.TIMESTAMP]: number;
    [DataType.TIME]: number;
    [DataType.YEAR]: number;
    [DataType.CHAR]: string;
    [DataType.VARCHAR]: string;
    [DataType.BINARY]: string;
    [DataType.VARBINARY]: string;
    [DataType.BLOB]: string;
    [DataType.TEXT]: string;
    [DataType.TSVECTOR]: string;
    [DataType.NULL]: null;
}[DATATYPE];
export declare type Row<SCHEMA, COLUMNS extends keyof SCHEMA = keyof SCHEMA> = {
    [COLUMN in COLUMNS]: Exclude<DataTypeValue<SCHEMA[COLUMN]>, null>;
};
export declare type DataTypeName<DATATYPE_NAMES extends Record<DataType, string>, DATATYPE> = DATATYPE extends DataType ? (DATATYPE extends infer D ? DATATYPE_NAMES[Extract<D, DataType>] : never) : never;
export {};
