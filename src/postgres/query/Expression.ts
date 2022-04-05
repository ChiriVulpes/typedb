import { createExpressionBuilder, Expression, ExpressionAndOr, ExpressionBuilder, ExpressionBuilderOptions } from "../../base/query/Expression";
import Bound from "../../decorator/Bound";
import Override from "../../decorator/Override";

const operations: { [key: string]: string } = {
	"==": "=",
	"~~": "=",
	"!~": "!=",
};

type ExpressionBuilderOptions2 = ExpressionBuilderOptions & { needsNewAndOrBuilder?: false };

export class PostgresExpression<SCHEMA extends { [key: string]: any }> extends Expression<SCHEMA> {

	public constructor (private readonly registerValue: (value?: string | number | null | (string | number | null)[]) => string) {
		super();
	}

	@Override public get is (): ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>> {
		return createExpressionBuilder(this.createBuilder);
	}

	@Bound
	public createBuilder (options: ExpressionBuilderOptions2, column: string | ((expr: ExpressionBuilder<SCHEMA, any>) => any), operation?: string, ...values: (string | number | null)[]) {
		const builder = (options.needsNewAndOrBuilder === false ? undefined : new PostgresExpressionAndOr(this)) as PostgresExpressionAndOr<SCHEMA>;

		const notString = options.not ? "NOT " : "";

		if ("condition" in options)
			if (!options.condition || (typeof options.condition === "function" && !options.condition())) {
				this["lastFilterEditable"] = false;
				return builder;
			}

		if (typeof column === "function") {
			const expr = new PostgresExpression<SCHEMA>(this.registerValue);
			column(expr.is);
			this.addFilter(() => {
				const exprStr = expr.compile();
				return !exprStr ? "" : notString ? `(${notString}(${exprStr}))` : `${exprStr}`;
			});

		} else if (values[0] === null)
			this.addFilter(`(${notString}${column} IS ${operation === "==" ? "" : "NOT"} NULL)`);

		else if (operation === "CONTAINS" || operation === "@>")
			this.addFilter(() => values.length === 1 ? `(${notString}${this.registerValue(values[0])} = ANY(${column}))`
				: `(${notString}${column} @> ${this.registerValue(values)})`);

		else if (operation === "CONTAINED_BY" || operation === "<@")
			this.addFilter(() => `(${notString}${column} <@ ${this.registerValue(values)})`);

		else if (operation === "IN")
			this.addFilter(() => `(${notString}${column} = ANY(${this.registerValue(values[0])}))`);

		else if (operation === "HAVE_SUBSTR" || operation === "HAS_SUBSTR")
			this.addFilter(() => `(${notString}position(${this.registerValue(values[0])} in ${column}) > 0)`);

		else if (operation === "SUBSTR_OF")
			this.addFilter(() => `(${notString}position(${column} in ${this.registerValue(values[0])}) > 0)`);

		else if (operation === "HAVE_WORD" || operation === "HAS_WORD")
			this.addFilter(() => `(${notString}${column} @@ to_tsquery(${this.registerValue(values[0])}))`);

		else if (operation === "BETWEEN")
			this.addFilter(() => `(${notString}${column} BETWEEN ${this.registerValue(values[0])} AND ${this.registerValue(values[1])})`);

		else if (operation === "~~" || operation === "!~")
			this.addFilter(() => `(${notString}lower(${column}) ${operations[`${operation}`] || operation} ${this.registerValue(`${values[0]}`.toLowerCase())})`);

		else this.addFilter(() => `(${notString}${column} ${operations[`${operation}`] || operation} ${this.registerValue(values[0])})`);

		this["lastFilterEditable"] = true;
		return builder;
	}
}

class PostgresExpressionAndOr<SCHEMA extends { [key: string]: any }> extends ExpressionAndOr<SCHEMA> {

	public constructor (private readonly expression: PostgresExpression<SCHEMA>) {
		super();
	}

	@Override public get and (): ExpressionBuilder<SCHEMA, this> {
		return createExpressionBuilder((options, column, operation, ...values) => {
			this.expression.createBuilder({ ...options, needsNewAndOrBuilder: false }, column, operation, ...values);
			this.expression["tweakLastFilter"]((filter, previous) => previous && filter ? ` AND ${filter}` : filter);
			return this;
		});
	}

	@Override public get or (): ExpressionBuilder<SCHEMA, this> {
		return createExpressionBuilder((options, column, operation, ...values) => {
			this.expression.createBuilder({ ...options, needsNewAndOrBuilder: false }, column, operation, ...values);
			this.expression["tweakLastFilter"]((filter, previous) => previous && filter ? ` OR ${filter}` : filter);
			return this;
		});
	}
}
