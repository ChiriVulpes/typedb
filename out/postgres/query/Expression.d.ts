import { Expression, ExpressionAndOr, ExpressionBuilder, ExpressionBuilderOptions } from "../../base/query/Expression";
declare type ExpressionBuilderOptions2 = ExpressionBuilderOptions & {
    needsNewAndOrBuilder?: false;
};
export declare class PostgresExpression<SCHEMA extends {
    [key: string]: any;
}> extends Expression<SCHEMA> {
    private readonly registerValue;
    constructor(registerValue: (value?: string | number | null | (string | number | null)[]) => string);
    get is(): ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>;
    createBuilder(options: ExpressionBuilderOptions2, column: string | ((expr: ExpressionBuilder<SCHEMA, any>) => any), operation?: string, ...values: (string | number | null)[]): PostgresExpressionAndOr<SCHEMA>;
}
declare class PostgresExpressionAndOr<SCHEMA extends {
    [key: string]: any;
}> extends ExpressionAndOr<SCHEMA> {
    private readonly expression;
    constructor(expression: PostgresExpression<SCHEMA>);
    get and(): ExpressionBuilder<SCHEMA, this>;
    get or(): ExpressionBuilder<SCHEMA, this>;
}
export {};
