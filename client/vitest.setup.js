/* This makes imports below available in all tests */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
    cleanup(); // Cleans up DOM after each component test 
});
