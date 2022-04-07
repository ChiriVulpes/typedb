export default class QueryParametersProvider<VALUES = {}> {
    private readonly values;
    private ids;
    provide<NEW_VALUES>(values: NEW_VALUES): QueryParametersProvider<VALUES & NEW_VALUES>;
    add(value: any): string;
    use(id: keyof VALUES): Record<keyof VALUES, `$${bigint}`>[keyof VALUES];
    getValues(): any[];
}
