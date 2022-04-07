"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataType = void 0;
var DataType;
(function (DataType) {
    // numeric
    DataType[DataType["INTEGER"] = 0] = "INTEGER";
    DataType[DataType["INT"] = 1] = "INT";
    DataType[DataType["SMALLINT"] = 2] = "SMALLINT";
    DataType[DataType["TINYINT"] = 3] = "TINYINT";
    DataType[DataType["MEDIUMINT"] = 4] = "MEDIUMINT";
    DataType[DataType["BIGINT"] = 5] = "BIGINT";
    DataType[DataType["DECIMAL"] = 6] = "DECIMAL";
    DataType[DataType["NUMERIC"] = 7] = "NUMERIC";
    DataType[DataType["FLOAT"] = 8] = "FLOAT";
    DataType[DataType["DOUBLE"] = 9] = "DOUBLE";
    DataType[DataType["BIT"] = 10] = "BIT";
    // datetime
    DataType[DataType["DATE"] = 11] = "DATE";
    DataType[DataType["DATETIME"] = 12] = "DATETIME";
    DataType[DataType["TIMESTAMP"] = 13] = "TIMESTAMP";
    DataType[DataType["TIME"] = 14] = "TIME";
    DataType[DataType["YEAR"] = 15] = "YEAR";
    // string
    DataType[DataType["CHAR"] = 16] = "CHAR";
    DataType[DataType["VARCHAR"] = 17] = "VARCHAR";
    DataType[DataType["BINARY"] = 18] = "BINARY";
    DataType[DataType["VARBINARY"] = 19] = "VARBINARY";
    DataType[DataType["BLOB"] = 20] = "BLOB";
    DataType[DataType["TEXT"] = 21] = "TEXT";
    // ENUM, // handled by a string union
    // SET, // handled by a string array
    // special
    DataType[DataType["NULL"] = 22] = "NULL";
    DataType[DataType["TSVECTOR"] = 23] = "TSVECTOR";
})(DataType = exports.DataType || (exports.DataType = {}));
