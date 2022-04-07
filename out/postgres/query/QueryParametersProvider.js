"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryParametersProvider {
    values = [];
    ids = {};
    provide(values) {
        for (const [key, value] of Object.entries(values))
            this.ids[key] = `$${this.values.push(value)}`;
        return this;
    }
    add(value) {
        return `$${this.values.push(value)}`;
    }
    use(id) {
        return this.ids[id];
    }
    getValues() {
        return this.values;
    }
}
exports.default = QueryParametersProvider;
