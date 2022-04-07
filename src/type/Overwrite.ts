type Overwrite<T, O> =
	{ [K in Exclude<keyof T, keyof O>]: T[K] }
	& { [K in keyof O]: O[K] };

export default Overwrite;
