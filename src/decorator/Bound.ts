export default function (target: any, key: string | number | symbol, descriptor: PropertyDescriptor) {
	let fn = descriptor.value;
	const configurable = true;

	return {
		configurable,
		get () {
			if (!this || this === target.prototype || this.hasOwnProperty(key) || typeof fn !== "function") {
				return fn;
			}

			const boundFn = fn.bind(this);
			Object.defineProperty(this, key, {
				configurable,
				get () {
					return boundFn;
				},
				set (value) {
					fn = value;
					delete this[key];
				},
			});

			return boundFn;
		},
		set (value: any) {
			fn = value;
		},
	};
}
