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
const Insert_1 = __importDefault(require("../../base/query/Insert"));
const Override_1 = __importDefault(require("../../decorator/Override"));
class PostgresInsert extends Insert_1.default {
    table;
    columns;
    valuesToAdd = [];
    returnColumns = [];
    constructor(table, columns) {
        super();
        this.table = table;
        this.columns = columns;
    }
    values(...values) {
        this.valuesToAdd.push(values);
        return this;
    }
    returning(...columns) {
        this.returnColumns = columns;
        return this;
    }
    async query(pool, resultObject) {
        const results = await this.table.query(pool, this.compile());
        if (resultObject)
            return results;
        return this.returnColumns.length ? results.rows : results.rowCount;
    }
    compile() {
        let query = `INSERT INTO ${this.table.name}`;
        if (this.columns.length)
            query += ` (${this.columns.join(",")})`;
        const values = [];
        function registerValue(value) {
            values.push(value);
            return `$${values.length}`;
        }
        if (!this.valuesToAdd.length)
            throw new Error("No data to insert");
        query += ` VALUES ${this.valuesToAdd.map(row => `(${row.map(registerValue).join(", ")})`).join(",")}`;
        if (this.returnColumns.length)
            query += ` RETURNING ${this.returnColumns.join(",")}`;
        return { query, values };
    }
}
__decorate([
    Override_1.default
], PostgresInsert.prototype, "values", null);
__decorate([
    Override_1.default
], PostgresInsert.prototype, "query", null);
exports.default = PostgresInsert;
