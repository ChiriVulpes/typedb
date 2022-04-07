"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("./DataType");
var NumericOperations;
(function (NumericOperations) {
    NumericOperations[NumericOperations["=="] = 0] = "==";
    NumericOperations[NumericOperations["!="] = 1] = "!=";
    NumericOperations[NumericOperations["<"] = 2] = "<";
    NumericOperations[NumericOperations[">"] = 3] = ">";
    NumericOperations[NumericOperations["<="] = 4] = "<=";
    NumericOperations[NumericOperations[">="] = 5] = ">=";
    NumericOperations[NumericOperations["IN"] = 6] = "IN";
    NumericOperations[NumericOperations["BETWEEN"] = 7] = "BETWEEN";
})(NumericOperations || (NumericOperations = {}));
var StringOperations;
(function (StringOperations) {
    StringOperations[StringOperations["=="] = 0] = "==";
    StringOperations[StringOperations["!="] = 1] = "!=";
    StringOperations[StringOperations["~~"] = 2] = "~~";
    StringOperations[StringOperations["!~"] = 3] = "!~";
    StringOperations[StringOperations["IN"] = 4] = "IN";
    StringOperations[StringOperations["HAS_SUBSTR"] = 5] = "HAS_SUBSTR";
    StringOperations[StringOperations["HAVE_SUBSTR"] = 6] = "HAVE_SUBSTR";
    StringOperations[StringOperations["IS_SUBSTR"] = 7] = "IS_SUBSTR";
})(StringOperations || (StringOperations = {}));
var ArrayOperations;
(function (ArrayOperations) {
    ArrayOperations[ArrayOperations["CONTAINS"] = 0] = "CONTAINS";
    ArrayOperations[ArrayOperations["@>"] = 1] = "@>";
    ArrayOperations[ArrayOperations["CONTAINED_BY"] = 2] = "CONTAINED_BY";
    ArrayOperations[ArrayOperations["<@"] = 3] = "<@";
})(ArrayOperations || (ArrayOperations = {}));
var TSVectorOperations;
(function (TSVectorOperations) {
    TSVectorOperations[TSVectorOperations["HAVE_WORD"] = 0] = "HAVE_WORD";
    TSVectorOperations[TSVectorOperations["HAS_WORD"] = 1] = "HAS_WORD";
})(TSVectorOperations || (TSVectorOperations = {}));
