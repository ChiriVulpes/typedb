import { ExpressionBuilder } from "./Expression";

export default abstract class Delete<SCHEMA extends { [key: string]: any }, RETURN> {

	public abstract get where (): ExpressionBuilder<SCHEMA, this>;

	public abstract query (): Promise<RETURN>;
}
