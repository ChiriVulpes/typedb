"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = __importDefault(require("./Table"));
class PostgresDatabase {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    setPool(pool) {
        this.pool = pool;
        return this;
    }
    getTable(name, pool = this.pool) {
        return new Table_1.default(name, pool);
    }
}
exports.default = PostgresDatabase;
