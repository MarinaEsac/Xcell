export const Debounce = (func: unknown, delay: number) => {

    let timer: NodeJS.Timeout;
    return (...args: unknown[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {

            if (typeof func === "function") {
                func!.apply(this, args);
            }
        }, delay);
    };
};