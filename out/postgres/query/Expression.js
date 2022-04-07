"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresExpression = void 0;
const Expression_1 = require("../../base/query/Expression");
const Bound_1 = __importDefault(require("../../decorator/Bound"));
const Override_1 = __importDefault(require("../../decorator/Override"));
const operations = {
    "==": "=",
    "~~": "=",
    "!~": "!=",
};
class PostgresExpression extends Expression_1.Expression {
    registerValue;
    constructor(registerValue) {
        super();
        this.registerValue = registerValue;
    }
    get is() {
        return (0, Expression_1.createExpressionBuilder)(this.createBuilder);
    }
    createBuilder(options, column, operation, ...values) {
        const builder = (options.needsNewAndOrBuilder === false ? undefined : new PostgresExpressionAndOr(this));
        const notString = options.not ? "NOT " : "";
        if ("condition" in options)
            if (!options.condition || (typeof options.condition === "function" && !options.condition())) {
                this["lastFilterEditable"] = false;
                return builder;
            }
        if (typeof column === "function") {
            const expr = new PostgresExpression(this.registerValue);
            column(expr.is);
            this.addFilter(() => {
                const exprStr = expr.compile();
                return !exprStr ? "" : notString ? `(${notString}(${exprStr}))` : `${exprStr}`;
            });
        }
        else if (values[0] === null)
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
        else
            this.addFilter(() => `(${notString}${column} ${operations[`${operation}`] || operation} ${this.registerValue(values[0])})`);
        this["lastFilterEditable"] = true;
        return builder;
    }
}
__decorate([
    Override_1.default
], PostgresExpression.prototype, "is", null);
__decorate([
    Bound_1.default
], PostgresExpression.prototype, "createBuilder", null);
exports.PostgresExpression = PostgresExpression;
class PostgresExpressionAndOr extends Expression_1.ExpressionAndOr {
    expression;
    constructor(expression) {
        super();
        this.expression = expression;
    }
    get and() {
        return (0, Expression_1.createExpressionBuilder)((options, column, operation, ...values) => {
            this.expression.createBuilder({ ...options, needsNewAndOrBuilder: false }, column, operation, ...values);
            this.expression["tweakLastFilter"]((filter, previous) => previous && filter ? ` AND ${filter}` : filter);
            return this;
        });
    }
    get or() {
        return (0, Expression_1.createExpressionBuilder)((options, column, operation, ...values) => {
            this.expression.createBuilder({ ...options, needsNewAndOrBuilder: false }, column, operation, ...values);
            this.expression["tweakLastFilter"]((filter, previous) => previous && filter ? ` OR ${filter}` : filter);
            return this;
        });
    }
}
__decorate([
    Override_1.default
], PostgresExpressionAndOr.prototype, "and", null);
__decorate([
    Override_1.default
], PostgresExpressionAndOr.prototype, "or", null);
