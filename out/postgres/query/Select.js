"use strict";
// tslint:disable no-string-literal
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
const Expression_1 = require("../../base/query/Expression");
const Select_1 = __importDefault(require("../../base/query/Select"));
const Bound_1 = __importDefault(require("../../decorator/Bound"));
const Override_1 = __importDefault(require("../../decorator/Override"));
const Expression_2 = require("./Expression");
class PostgresSelect extends Select_1.default {
    table;
    columns;
    expression = new Expression_2.PostgresExpression(this.value);
    values = [];
    constructor(table, columns) {
        super();
        this.table = table;
        this.columns = columns;
    }
    get where() {
        return (0, Expression_1.createExpressionBuilder)((options, column, operation, ...values) => {
            this.expression.createBuilder(options, column, operation, ...values);
            this.expression["tweakLastFilter"]((filter, previous) => previous && filter ? ` AND (${filter})` : filter);
            return this;
        });
    }
    async query(pool, resultObject) {
        const results = await this.table.query(pool, this.compile());
        if (resultObject)
            return results;
        return results.rows;
    }
    async queryOne(pool) {
        const result = await this.limit(1).query(pool);
        return result[0];
    }
    compile() {
        let query = `SELECT ${this.columns === "*" ? "*" : this.columns.join(",")} FROM ${this.table.name}`;
        const where = this.expression.compile();
        if (where)
            query += ` WHERE ${where}`;
        if (this.orderBy)
            query += ` ORDER BY ${this.orderBy["order"]
                .map(order => order.join(" "))
                .join(",")}`;
        if (typeof this.limitAmount === "number")
            query += ` LIMIT ${this.limitAmount}`;
        if (typeof this.offsetAmount === "number")
            query += ` OFFSET ${this.offsetAmount}`;
        return { query, values: this.values };
    }
    value(value) {
        this.values.push(value);
        return `$${this.values.length}`;
    }
}
__decorate([
    Override_1.default
], PostgresSelect.prototype, "where", null);
__decorate([
    Override_1.default
], PostgresSelect.prototype, "query", null);
__decorate([
    Override_1.default
], PostgresSelect.prototype, "queryOne", null);
__decorate([
    Bound_1.default
], PostgresSelect.prototype, "value", null);
exports.default = PostgresSelect;
