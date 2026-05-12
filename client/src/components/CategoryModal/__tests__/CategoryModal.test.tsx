import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryModal from '../CategoryModal';

function setup(category?: { id: number; name: string; color: string; icon: string }) {
  const onSave = vi.fn();
  const onClose = vi.fn();
  render(<CategoryModal category={category} onSave={onSave} onClose={onClose} />);
  return { onSave, onClose };
}

const getInput = () => screen.getByLabelText('Name');

describe('CategoryModal — validation', () => {
  it('shows "Name is required" when submitting empty form', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('shows error for name longer than 15 characters', async () => {
    setup();
    fireEvent.change(getInput(), { target: { value: 'a'.repeat(16) } });
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByText(/15 characters or less/i)).toBeInTheDocument();
  });

  it('shows error for special characters', async () => {
    setup();
    await userEvent.type(getInput(), 'work@home');
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByText(/only letters/i)).toBeInTheDocument();
  });

  it('accepts letters, numbers, spaces and hyphens', async () => {
    const { onSave } = setup();
    await userEvent.type(getInput(), 'Work-2');
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onSave).toHaveBeenCalled();
  });

  it('clears error while typing a valid correction', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();

    await userEvent.type(getInput(), 'Work');
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });
});

describe('CategoryModal — submission', () => {
  it('calls onSave with trimmed name, color and icon', async () => {
    const { onSave } = setup();
    await userEvent.type(getInput(), 'Work');
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onSave).toHaveBeenCalledWith('Work', expect.any(String), expect.any(String));
  });

  it('does not call onSave when name is invalid', async () => {
    const { onSave } = setup();
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows "Save changes" button when editing an existing category', () => {
    setup({ id: 1, name: 'Work', color: '#3b82f6', icon: 'Briefcase' });
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('pre-fills name field when editing', () => {
    setup({ id: 1, name: 'Work', color: '#3b82f6', icon: 'Briefcase' });
    expect(getInput()).toHaveValue('Work');
  });
});

describe('CategoryModal — close behavior', () => {
  it('calls onClose when Cancel is clicked', async () => {
    const { onClose } = setup();
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
