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
exports.PostgresUpdateSwitch = void 0;
const Delete_1 = __importDefault(require("../../base/query/Delete"));
const Expression_1 = require("../../base/query/Expression");
const Bound_1 = __importDefault(require("../../decorator/Bound"));
const Override_1 = __importDefault(require("../../decorator/Override"));
const Expression_2 = require("./Expression");
class PostgresDelete extends Delete_1.default {
    table;
    expression = new Expression_2.PostgresExpression(this.value);
    values = [];
    constructor(table) {
        super();
        this.table = table;
    }
    get where() {
        return (0, Expression_1.createExpressionBuilder)((options, column, operation, ...values) => {
            this.expression.createBuilder(options, column, operation, ...values);
            return this;
        });
    }
    async query(pool) {
        return await this.table.query(pool, this.compile());
    }
    compile() {
        let query = `DELETE FROM ${this.table.name}`;
        const where = this.expression.compile();
        if (where)
            query += ` WHERE ${where}`;
        return { query, values: this.values };
    }
    value(value) {
        this.values.push(value);
        return `$${this.values.length}`;
    }
}
__decorate([
    Override_1.default
], PostgresDelete.prototype, "where", null);
__decorate([
    Override_1.default
], PostgresDelete.prototype, "query", null);
__decorate([
    Bound_1.default
], PostgresDelete.prototype, "value", null);
exports.default = PostgresDelete;
class PostgresUpdateSwitch {
    values;
    type;
    cases = [];
    elseValue;
    constructor(values, type) {
        this.values = values;
        this.type = type;
    }
    get when() {
        return (0, Expression_1.createExpressionBuilder)((options, column, operation, ...values) => {
            const expression = new Expression_2.PostgresExpression(this.value);
            expression.createBuilder(options, column, operation, ...values);
            return {
                then: value => {
                    this.cases.push([expression, value]);
                    return this;
                },
            };
        });
    }
    else(value) {
        this.elseValue = value;
        return this;
    }
    // @ts-ignore
    compile() {
        let query = `(CASE `;
        const cases = this.cases.map(([expression, value]) => [expression.compile(), value])
            .filter(([expression]) => expression);
        if (!cases.length)
            throw new Error("No cases for update");
        query += cases.map(([expression, value]) => `WHEN ${expression} THEN ${this.value(value)}`).join(" ");
        if (this.elseValue !== undefined)
            query += ` ELSE ${this.value(this.elseValue)}`;
        return query + " END)" + (this.type ? `::${this.type}` : "");
    }
    value(value) {
        this.values.push(value);
        return `$${this.values.length}`;
    }
}
__decorate([
    Bound_1.default
], PostgresUpdateSwitch.prototype, "value", null);
exports.PostgresUpdateSwitch = PostgresUpdateSwitch;
