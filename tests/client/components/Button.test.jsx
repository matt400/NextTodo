import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@client/components/Button'; // Używamy aliasu @client

describe('Button Component', () => {
    // Test 1 
    test('renders with correct text', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    // Test 2 
    test('calls onClick handler when clicked', () => {
        const handleClick = vi.fn(); 
        render(<Button onClick={handleClick}>Submit</Button>);

        fireEvent.click(screen.getByText('Submit'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // Test 3 
    test('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>);
        const button = screen.getByText('Disabled Button');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('opacity-50');
    });

    // Test 4 
    test('renders with danger variant', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByText('Delete');
        expect(button).toHaveClass('bg-red-500');
        expect(button).not.toHaveClass('bg-blue-500');
    });
});
