describe('useCounter Hook', () => {
    test('should initialize with the default value', () => {
        const { result } = renderHook(() => useCounter());
        
        // result.current always holds the latest values returned from the hook
        expect(result.current.count).toBe(0);
    });

    test('should initialize with a provided initial value', () => {
        const { result } = renderHook(() => useCounter(10));
        expect(result.current.count).toBe(10);
    });

    test('should increment the counter value', () => {
        const { result } = renderHook(() => useCounter(0));

        // All state-changing actions MUST be wrapped inside act()
        act(() => {
            result.current.increment();
        });

        expect(result.current.count).toBe(1);
    });

    test('should decrement the counter value', () => {
        const { result } = renderHook(() => useCounter(5));

        act(() => {
            result.current.decrement();
        });

        expect(result.current.count).toBe(4);
    });

    test('should reset the counter to the initial value', () => {
        const { result } = renderHook(() => useCounter(100));

        act(() => {
            result.current.increment(); // 101
            result.current.reset();     // 100
        });

        expect(result.current.count).toBe(100);
    });
});
