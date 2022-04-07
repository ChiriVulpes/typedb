"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpressionBuilder = exports.ExpressionAndOr = exports.Expression = void 0;
class Expression {
    lastFilterEditable = false;
    filters = [];
    compile() {
        return this.filters.map(filter => typeof filter === "string" ? filter : filter())
            .join("");
    }
    tweakLastFilter(tweaker) {
        if (!this.lastFilterEditable)
            return;
        const existingFilter = this.filters[this.filters.length - 1];
        const previousFilter = this.filters[this.filters.length - 2];
        this.filters[this.filters.length - 1] = () => tweaker(typeof existingFilter === "string" ? existingFilter : existingFilter(), previousFilter);
    }
    addFilter(filter) {
        if (filter)
            this.filters.push(filter);
    }
}
exports.Expression = Expression;
class ExpressionAndOr {
}
exports.ExpressionAndOr = ExpressionAndOr;
function createExpressionBuilder(builder, ...excludedProperties) {
    const resultBuilder = ((column, operation, ...values) => {
        return builder({}, column, operation, ...values);
    });
    if (!excludedProperties.includes("not")) {
        Object.defineProperty(resultBuilder, "not", {
            get() {
                return createExpressionBuilder((options, column, operation, ...values) => builder({ ...options, not: true }, column, operation, ...values));
            },
        });
    }
    if (!excludedProperties.includes("if")) {
        Object.defineProperty(resultBuilder, "if", {
            get() {
                return (condition, column, operation, ...values) => builder({ condition }, column, operation, ...values);
            },
        });
    }
    return resultBuilder;
}
exports.createExpressionBuilder = createExpressionBuilder;
