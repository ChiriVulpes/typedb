export default function (target: any, key: string | number | symbol, descriptor: PropertyDescriptor): {
    configurable: boolean;
    get(): any;
    set(value: any): void;
};
