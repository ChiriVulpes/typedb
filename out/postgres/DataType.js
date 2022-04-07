"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresDataTypes = void 0;
const DataType_1 = require("../base/DataType");
exports.postgresDataTypes = {
    // numeric
    [DataType_1.DataType.INTEGER]: "INTEGER",
    [DataType_1.DataType.INT]: "INTEGER",
    [DataType_1.DataType.SMALLINT]: "SMALLINT",
    [DataType_1.DataType.TINYINT]: "SMALLINT",
    [DataType_1.DataType.MEDIUMINT]: "INTEGER",
    [DataType_1.DataType.BIGINT]: "BIGINT",
    [DataType_1.DataType.DECIMAL]: "DECIMAL",
    [DataType_1.DataType.NUMERIC]: "NUMERIC",
    [DataType_1.DataType.FLOAT]: "REAL",
    [DataType_1.DataType.DOUBLE]: "DOUBLE PRECISION",
    [DataType_1.DataType.BIT]: "",
    // datetime
    [DataType_1.DataType.DATE]: "DATE",
    [DataType_1.DataType.DATETIME]: "TIMESTAMP",
    [DataType_1.DataType.TIMESTAMP]: "TIMESTAMP",
    [DataType_1.DataType.TIME]: "TIME",
    [DataType_1.DataType.YEAR]: "",
    // string
    [DataType_1.DataType.CHAR]: "",
    [DataType_1.DataType.VARCHAR]: "",
    [DataType_1.DataType.BINARY]: "",
    [DataType_1.DataType.VARBINARY]: "",
    [DataType_1.DataType.BLOB]: "",
    [DataType_1.DataType.TEXT]: "TEXT",
    // ENUM, // handled by a string union
    // SET, // handled by a string array
    // special
    [DataType_1.DataType.NULL]: "",
    [DataType_1.DataType.TSVECTOR]: "",
};
