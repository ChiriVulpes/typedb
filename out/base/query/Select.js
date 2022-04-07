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
const Bound_1 = __importDefault(require("../../decorator/Bound"));
class Select {
    limitAmount;
    offsetAmount;
    orderBy;
    limit(amt) {
        this.limitAmount = amt;
        return this;
    }
    offset(amt) {
        this.offsetAmount = amt;
        return this;
    }
    order(orderer, direction) {
        this.orderBy = new OrderBy();
        if (typeof orderer === "function")
            orderer(this.orderBy.then);
        else
            this.orderBy.then(orderer, direction);
        return this;
    }
}
exports.default = Select;
class OrderBy {
    order = [];
    then(...args) {
        this.order.push(args);
        return this;
    }
}
__decorate([
    Bound_1.default
], OrderBy.prototype, "then", null);
