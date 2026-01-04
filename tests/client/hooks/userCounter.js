import { useState, useCallback } from 'react';

export function useCounter(initialValue = 0) {
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => setCount((x) => x + 1), []);
    const decrement = useCallback(() => setCount((x) => x - 1), []);
    const reset = useCallback(() => setCount(initialValue), [initialValue]);

    return { count, increment, decrement, reset };
}
