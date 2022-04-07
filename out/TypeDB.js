"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Postgres = void 0;
// import MySQLDatabase from "./mysql/Database";
const Database_1 = __importDefault(require("./postgres/Database"));
exports.Postgres = Database_1.default;
