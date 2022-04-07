import { DataTypeArrayValue, DataTypeValue } from "../DataType";
import { Operations } from "../Operations";

export abstract class Expression<SCHEMA extends { [key: string]: any }> {
	protected lastFilterEditable = false;
	private readonly filters: (string | (() => string))[] = [];

	public abstract get is (): ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>;

	public compile () {
		return this.filters.map(filter => typeof filter === "string" ? filter : filter())
			.join("");
	}

	protected tweakLastFilter (tweaker: (filter: string, previousFilter?: string | (() => string)) => string) {
		if (!this.lastFilterEditable) return;
		const existingFilter = this.filters[this.filters.length - 1];
		const previousFilter = this.filters[this.filters.length - 2];
		this.filters[this.filters.length - 1] = () =>
			tweaker(typeof existingFilter === "string" ? existingFilter : existingFilter(), previousFilter);
	}

	protected addFilter (filter: string | (() => string)) {
		if (filter) this.filters.push(filter);
	}
}

export abstract class ExpressionAndOr<SCHEMA extends { [key: string]: any }> {
	public abstract get and (): ExpressionBuilder<SCHEMA, this>;
	public abstract get or (): ExpressionBuilder<SCHEMA, this>;
}

type ColumnOperations<SCHEMA extends { [key: string]: any }, KEY extends keyof SCHEMA> =
	Operations<SCHEMA[KEY]> | "==" | "!=";

export interface ExpressionBuilder<SCHEMA extends { [key: string]: any }, RETURN> extends ExpressionBuilderExtensions<SCHEMA, RETURN> {
	(initializer: (expr: ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>) => any): RETURN;
	<KEY extends keyof SCHEMA, OPERATION extends ColumnOperations<SCHEMA, KEY>> (column: KEY, operation: OPERATION, ...args: ExpressionBuilderArguments<SCHEMA, KEY, OPERATION>): RETURN;
}

interface ExpressionBuilderExtensions<SCHEMA extends { [key: string]: any }, RETURN> {
	not: ExpressionBuilder<SCHEMA, RETURN>;
	if<KEY extends keyof SCHEMA, OPERATION extends ColumnOperations<SCHEMA, KEY>> (condition: any, column: KEY, operation: OPERATION, ...args: ExpressionBuilderArguments<SCHEMA, KEY, OPERATION>): RETURN;
}

type ExpressionBuilderArguments<SCHEMA extends { [key: string]: any }, KEY extends keyof SCHEMA, OPERATION extends ColumnOperations<SCHEMA, KEY>> =
	OPERATION extends "==" | "!=" ? [null | (OPERATION extends Operations<SCHEMA[KEY]> ? DataTypeValue<SCHEMA[KEY]> : never)] :
	OPERATION extends "BETWEEN" ? [DataTypeValue<SCHEMA[KEY]>, DataTypeValue<SCHEMA[KEY]>] :
	OPERATION extends "CONTAINS" ? DataTypeArrayValue<SCHEMA[KEY]>[] :
	OPERATION extends "IN" ? [DataTypeValue<SCHEMA[KEY]>[]] :
	OPERATION extends Operations<SCHEMA[KEY]> ? [DataTypeValue<SCHEMA[KEY]>] :
	never;

export interface ExpressionBuilderOptions {
	not?: boolean;
	condition?: any;
}

export type ExpressionBuilderFunction<RETURN, SCHEMA extends { [key: string]: any }> =
	(options: ExpressionBuilderOptions, column: string | ((expr: ExpressionBuilder<SCHEMA, any>) => any), operation?: string, ...values: (string | number | null)[]) => RETURN;

export function createExpressionBuilder<RETURN, SCHEMA extends { [key: string]: any }>
	(builder: ExpressionBuilderFunction<RETURN, SCHEMA>, ...excludedProperties: (keyof ExpressionBuilderExtensions<SCHEMA, RETURN>)[]): ExpressionBuilder<SCHEMA, RETURN> {

	const resultBuilder = ((column: string | ((expr: ExpressionBuilder<SCHEMA, any>) => any), operation?: string, ...values: (string | number | null)[]) => {
		return builder({}, column, operation, ...values);
	}) as any as ExpressionBuilder<SCHEMA, RETURN>;

	if (!excludedProperties.includes("not")) {
		Object.defineProperty(resultBuilder, "not", {
			get (): ExpressionBuilder<SCHEMA, RETURN>["not"] {
				return createExpressionBuilder((options, column, operation, ...values) =>
					builder({ ...options, not: true }, column as never, operation, ...values));
			},
		});
	}

	if (!excludedProperties.includes("if")) {
		Object.defineProperty(resultBuilder, "if", {
			get (): ExpressionBuilder<SCHEMA, RETURN>["if"] {
				return (condition, column, operation, ...values): RETURN =>
					builder({ condition }, column as string, operation, ...values as any[]);
			},
		});
	}

	return resultBuilder;
}
