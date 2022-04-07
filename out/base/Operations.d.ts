import { DataType } from "./DataType";
declare enum NumericOperations {
    "==" = 0,
    "!=" = 1,
    "<" = 2,
    ">" = 3,
    "<=" = 4,
    ">=" = 5,
    "IN" = 6,
    "BETWEEN" = 7
}
declare enum StringOperations {
    "==" = 0,
    "!=" = 1,
    "~~" = 2,
    "!~" = 3,
    "IN" = 4,
    "HAS_SUBSTR" = 5,
    "HAVE_SUBSTR" = 6,
    "IS_SUBSTR" = 7
}
declare enum ArrayOperations {
    "CONTAINS" = 0,
    "@>" = 1,
    "CONTAINED_BY" = 2,
    "<@" = 3
}
declare enum TSVectorOperations {
    "HAVE_WORD" = 0,
    "HAS_WORD" = 1
}
declare type NumericOperation = keyof typeof NumericOperations;
declare type StringOperation = keyof typeof StringOperations;
declare type ArrayOperation = keyof typeof ArrayOperations;
declare type TSVectorOperation = keyof typeof TSVectorOperations;
export declare type Operations<DATATYPE extends DataType> = DATATYPE extends string ? StringOperation : DATATYPE extends string[] ? StringOperation : DATATYPE extends any[] ? ArrayOperation : {
    [DataType.INTEGER]: NumericOperation;
    [DataType.INT]: NumericOperation;
    [DataType.SMALLINT]: NumericOperation;
    [DataType.TINYINT]: NumericOperation;
    [DataType.MEDIUMINT]: NumericOperation;
    [DataType.BIGINT]: NumericOperation;
    [DataType.DECIMAL]: NumericOperation;
    [DataType.NUMERIC]: NumericOperation;
    [DataType.FLOAT]: NumericOperation;
    [DataType.DOUBLE]: NumericOperation;
    [DataType.BIT]: NumericOperation;
    [DataType.DATE]: NumericOperation;
    [DataType.DATETIME]: NumericOperation;
    [DataType.TIMESTAMP]: NumericOperation;
    [DataType.TIME]: NumericOperation;
    [DataType.YEAR]: NumericOperation;
    [DataType.CHAR]: StringOperation;
    [DataType.VARCHAR]: StringOperation;
    [DataType.BINARY]: StringOperation;
    [DataType.VARBINARY]: StringOperation;
    [DataType.BLOB]: StringOperation;
    [DataType.TEXT]: StringOperation;
    [DataType.TSVECTOR]: TSVectorOperation;
}[Exclude<DATATYPE, DataType.NULL>];
export {};
