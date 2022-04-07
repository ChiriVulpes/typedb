import { ExpressionBuilder } from "./Expression";
export default abstract class Delete<SCHEMA extends {
    [key: string]: any;
}, RETURN> {
    abstract get where(): ExpressionBuilder<SCHEMA, this>;
    abstract query(): Promise<RETURN>;
}
