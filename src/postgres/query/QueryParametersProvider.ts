export default class QueryParametersProvider<VALUES = {}> {
	private readonly values: any[] = [];

	private ids = {} as any as Record<keyof VALUES, `$${bigint}`>;

	public provide<NEW_VALUES> (values: NEW_VALUES): QueryParametersProvider<VALUES & NEW_VALUES> {
		for (const [key, value] of Object.entries(values))
			(this.ids as Record<string, `$${number}`>)[key] = `$${this.values.push(value)}`;
		return this as any;
	}

	public add (value: any) {
		return `$${this.values.push(value)}`;
	}

	public use (id: keyof VALUES) {
		return this.ids[id];
	}

	public getValues () {
		return this.values;
	}
}
