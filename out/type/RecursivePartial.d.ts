declare type RecursivePartial<T> = {
    [0]: {
        [P in keyof T]?: RecursivePartial<T[P]>;
    };
    [1]: T;
}[T extends Map<any, any> ? 1 : T extends object ? 0 : 1];
export default RecursivePartial;
