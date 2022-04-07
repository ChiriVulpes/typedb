import { DataType } from "./DataType";

enum NumericOperations {
	"==",
	"!=",
	"<",
	">",
	"<=",
	">=",
	"IN",
	"BETWEEN",
}

enum StringOperations {
	"==",
	"!=",
	"~~",
	"!~",
	"IN",
	"HAS_SUBSTR",
	"HAVE_SUBSTR",
	"IS_SUBSTR",
}

enum ArrayOperations {
	"CONTAINS",
	"@>",
	"CONTAINED_BY",
	"<@",
}

enum TSVectorOperations {
	"HAVE_WORD",
	"HAS_WORD",
}

type NumericOperation = keyof typeof NumericOperations;
type StringOperation = keyof typeof StringOperations;
type ArrayOperation = keyof typeof ArrayOperations;
type TSVectorOperation = keyof typeof TSVectorOperations;

export type Operations<DATATYPE extends DataType> =
	DATATYPE extends string ? StringOperation :
	DATATYPE extends string[] ? StringOperation :
	DATATYPE extends any[] ? ArrayOperation : {
		// numeric
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

		// datetime
		[DataType.DATE]: NumericOperation;
		[DataType.DATETIME]: NumericOperation;
		[DataType.TIMESTAMP]: NumericOperation;
		[DataType.TIME]: NumericOperation;
		[DataType.YEAR]: NumericOperation;

		// string
		[DataType.CHAR]: StringOperation;
		[DataType.VARCHAR]: StringOperation;
		[DataType.BINARY]: StringOperation;
		[DataType.VARBINARY]: StringOperation;
		[DataType.BLOB]: StringOperation;
		[DataType.TEXT]: StringOperation;

		// special
		[DataType.TSVECTOR]: TSVectorOperation;
	}[Exclude<DATATYPE, DataType.NULL>];
