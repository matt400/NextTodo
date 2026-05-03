import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTaskModal from '../AddTaskModal';

// Helper: renders the modal with mock callbacks
function setup() {
  const onAdd = vi.fn();
  const onClose = vi.fn();
  render(<AddTaskModal onAdd={onAdd} onClose={onClose} categories={[]} />);
  return { onAdd, onClose };
}

describe('AddTaskModal — validation', () => {
  it('shows "Title is required" when submitting empty form', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  it('shows error for title longer than 50 characters', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('Task Title'), 'a'.repeat(51));
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText(/less than 50 characters/i)).toBeInTheDocument();
  });

  it('shows error for unsupported characters', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('Task Title'), 'Task @#$%');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText(/unsupported characters/i)).toBeInTheDocument();
  });

  it('clears validation error while typing a valid correction', async () => {
    setup();
    // Trigger error first
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();

    // Start typing — error should clear
    await userEvent.type(screen.getByLabelText('Task Title'), 'Valid title');
    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
  });
});

describe('AddTaskModal — submission', () => {
  it('calls onAdd with title and description on valid submit', async () => {
    const { onAdd } = setup();

    await userEvent.type(screen.getByLabelText('Task Title'), 'Buy milk');
    await userEvent.type(screen.getByPlaceholderText(/enter description/i), 'From the store');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(onAdd).toHaveBeenCalledWith({ title: 'Buy milk', description: 'From the store', categoryId: null });
  });

  it('calls onClose after successful submit', async () => {
    const { onClose } = setup();

    await userEvent.type(screen.getByLabelText('Task Title'), 'Buy milk');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it('does NOT call onAdd when title is invalid', async () => {
    const { onAdd } = setup();
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(onAdd).not.toHaveBeenCalled();
  });
});

describe('AddTaskModal — close behavior', () => {
  it('calls onClose when X button is clicked', async () => {
    const { onClose } = setup();
    // The X button has no label — find by its position (it's the only non-submit button in header)
    const closeBtn = screen.getAllByRole('button').find(
      (btn) => !btn.textContent?.includes('Add') && !btn.textContent?.includes('Cancel')
    )!;
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const { onClose } = setup();
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
