
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
}

export type DataTypeValue<DATATYPE extends DataType | string | string[]> =
	DATATYPE extends string ? DATATYPE :
	DATATYPE extends string[] ? DATATYPE :
	{
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
		// [DataType.ENUM]: string;
		// [DataType.SET]: string;

		// special
		[DataType.NULL]: null;
	}[Extract<DATATYPE, DataType>];

export type Row<SCHEMA, COLUMNS extends keyof SCHEMA = keyof SCHEMA> = {
	[COLUMN in COLUMNS]: SCHEMA[COLUMN] extends DataType ? Exclude<DataTypeValue<SCHEMA[COLUMN]>, null> : SCHEMA[COLUMN];
};