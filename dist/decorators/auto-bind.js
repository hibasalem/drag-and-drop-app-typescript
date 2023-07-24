export function autoBind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const bindFunction = originalMethod.bind(this);
            return bindFunction;
        }
    };
    return adjDescriptor;
}
//# sourceMappingURL=auto-bind.js.map