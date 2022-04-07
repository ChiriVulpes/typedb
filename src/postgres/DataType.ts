import { DataType } from "../base/DataType";

export const postgresDataTypes = {
	// numeric
	[DataType.INTEGER]: "INTEGER",
	[DataType.INT]: "INTEGER",
	[DataType.SMALLINT]: "SMALLINT",
	[DataType.TINYINT]: "SMALLINT",
	[DataType.MEDIUMINT]: "INTEGER",
	[DataType.BIGINT]: "BIGINT",
	[DataType.DECIMAL]: "DECIMAL",
	[DataType.NUMERIC]: "NUMERIC",
	[DataType.FLOAT]: "REAL",
	[DataType.DOUBLE]: "DOUBLE PRECISION",
	[DataType.BIT]: "",

	// datetime
	[DataType.DATE]: "DATE",
	[DataType.DATETIME]: "TIMESTAMP",
	[DataType.TIMESTAMP]: "TIMESTAMP",
	[DataType.TIME]: "TIME",
	[DataType.YEAR]: "",

	// string
	[DataType.CHAR]: "",
	[DataType.VARCHAR]: "",
	[DataType.BINARY]: "",
	[DataType.VARBINARY]: "",
	[DataType.BLOB]: "",
	[DataType.TEXT]: "TEXT",
	// ENUM, // handled by a string union
	// SET, // handled by a string array

	// special
	[DataType.NULL]: "",
	[DataType.TSVECTOR]: "",
} as const;

export type PostgresDataTypeNames = typeof postgresDataTypes;
