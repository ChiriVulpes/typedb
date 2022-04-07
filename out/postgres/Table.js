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
const Table_1 = __importDefault(require("../base/Table"));
const Override_1 = __importDefault(require("../decorator/Override"));
const Delete_1 = __importDefault(require("./query/Delete"));
const Insert_1 = __importDefault(require("./query/Insert"));
const QueryParametersProvider_1 = __importDefault(require("./query/QueryParametersProvider"));
const Select_1 = __importDefault(require("./query/Select"));
const Update_1 = __importDefault(require("./query/Update"));
let ansicolor;
function color(color, text) {
    if (!ansicolor) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ansicolor = require("ansicolor");
            // eslint-disable-next-line no-empty
        }
        catch { }
        if (!ansicolor)
            return text;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return ansicolor[color](text);
}
class PostgresTable extends Table_1.default {
    name;
    pool;
    constructor(name, pool) {
        super(name);
        this.name = name;
        this.pool = pool;
    }
    select(...columns) {
        return new Select_1.default(this, columns);
    }
    /**
     * Note: Unlike with plain SQL, you *must* specify the columns you will modify.
     * This is because the parameters in `values` calls can't be strictly typed unless the column order is known, and it's not.
     */
    insert(...columns) {
        return new Insert_1.default(this, columns);
    }
    update() {
        return new Update_1.default(this);
    }
    delete() {
        return new Delete_1.default(this);
    }
    async query(pool, query) {
        if (pool && !(pool instanceof Promise) && (typeof pool !== "object" || {}.constructor === pool.constructor)) {
            query = pool;
            pool = this.pool;
        }
        if (pool instanceof Promise)
            pool = await pool;
        if (typeof query === "function") {
            const parametersProvider = new QueryParametersProvider_1.default();
            query = {
                query: query(parametersProvider).replace(/[ \t]+/g, " ").replace(/\n\s+/g, "\n").trim(),
                values: parametersProvider.getValues(),
            };
        }
        let values = [];
        if (typeof query === "object") {
            values = query.values;
            query = query.query;
        }
        const valuesStr = values
            .map(value => {
            switch (typeof value) {
                case "bigint":
                case "number":
                    return color("green", `${value}`);
                case "string":
                    return color("lightCyan", `"${value}"`);
                default:
                    return color("lightGray", `${JSON.stringify(value)}`);
            }
        })
            .map((valueStr, i) => `${color("darkGray", `$${i + 1}:`)} ${valueStr}`)
            .join(color("darkGray", ", "));
        if (valuesStr.length >= 50)
            this.log(`  ${valuesStr}`);
        this.log(`  ${valuesStr.length < 50 ? `${valuesStr} ` : "  "}>`, color("darkGray", query));
        return new Promise((resolve, reject) => (pool || this.pool).query({ text: query, values }, (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        }));
    }
    log(prefix, text) {
        if (!process.env.DEBUG_PG)
            return;
        if (text === undefined)
            text = prefix, prefix = "";
        prefix = prefix ? prefix.slice(0, 50).trimEnd() + " " : prefix; // cap prefix length at 50
        const maxLineLength = 250 - prefix.length;
        text = text.split("\n")
            .flatMap(line => {
            const lines = [];
            while (line.length > maxLineLength) {
                lines.push(line.slice(0, maxLineLength));
                line = line.slice(maxLineLength);
            }
            lines.push(line.trimEnd());
            return lines;
        })
            .filter(line => line)
            .map((line, i) => i ? line.padStart(line.length + prefix.length, " ") : `${prefix}${line}`)
            .join("\n");
        console.log(text);
    }
}
__decorate([
    Override_1.default
], PostgresTable.prototype, "select", null);
__decorate([
    Override_1.default
], PostgresTable.prototype, "insert", null);
__decorate([
    Override_1.default
], PostgresTable.prototype, "update", null);
__decorate([
    Override_1.default
], PostgresTable.prototype, "delete", null);
__decorate([
    Override_1.default
], PostgresTable.prototype, "query", null);
exports.default = PostgresTable;
