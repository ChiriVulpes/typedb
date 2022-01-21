
export enum DataType {
	// numeric
	INTEGER,
	INT,
	SMALLINT,
	TINYINT,
	MEDIUMINT,
	BIGINT,
	DECIMAL,
	NUMERIC,
	FLOAT,
	DOUBLE,
	BIT,

	// datetime
	DATE,
	DATETIME,
	TIMESTAMP,
	TIME,
	YEAR,

	// string
	CHAR,
	VARCHAR,
	BINARY,
	VARBINARY,
	BLOB,
	TEXT,
	// ENUM, // handled by a string union
	// SET, // handled by a string array

	// special
	NULL,
	TSVECTOR,
}

export type DataTypeValue<DATATYPE> =
	DATATYPE extends string ? DATATYPE :
	DATATYPE extends string[] ? DATATYPE :
	DATATYPE extends DataType[] ? DataTypeValueInternal<DATATYPE extends (infer D)[] ? Extract<D, DataType> : never>[] :
	DATATYPE extends DataType ? DataTypeValueInternal<DATATYPE>
	: never;

export type DataTypeArrayValue<DATATYPE> =
	DATATYPE extends DataType[] ? DataTypeValueInternal<DATATYPE extends (infer D)[] ? Extract<D, DataType> : never>
	: DataTypeValue<DATATYPE>;

type DataTypeValueInternal<DATATYPE extends DataType> = {
	// numeric
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

	// datetime
	[DataType.DATE]: number;
	[DataType.DATETIME]: number;
	[DataType.TIMESTAMP]: number;
	[DataType.TIME]: number;
	[DataType.YEAR]: number;

	// string
	[DataType.CHAR]: string;
	[DataType.VARCHAR]: string;
	[DataType.BINARY]: string;
	[DataType.VARBINARY]: string;
	[DataType.BLOB]: string;
	[DataType.TEXT]: string;
	[DataType.TSVECTOR]: string;
	// [DataType.ENUM]: string;
	// [DataType.SET]: string;

	// special
	[DataType.NULL]: null;
}[DATATYPE];

export type Row<SCHEMA, COLUMNS extends keyof SCHEMA = keyof SCHEMA> = {
	[COLUMN in COLUMNS]: Exclude<DataTypeValue<SCHEMA[COLUMN]>, null>;
};

export type DataTypeName<DATATYPE_NAMES extends Record<DataType, string>, DATATYPE> =
	// DATATYPE extends DataType[] ? (DATATYPE extends (infer D)[] ? (typeof postgresDataTypes)[Extract<D, DataType>] : never) :
	DATATYPE extends DataType ? (DATATYPE extends infer D ? DATATYPE_NAMES[Extract<D, DataType>] : never)
	: never;
