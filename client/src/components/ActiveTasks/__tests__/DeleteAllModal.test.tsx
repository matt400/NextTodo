import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteAllModal from '../DeleteAllModal';

describe('DeleteAllModal — text', () => {
  it('shows "active" when type is active', () => {
    render(<DeleteAllModal type="active" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /delete all active tasks/i })).toBeInTheDocument();
  });

  it('shows "completed" when type is completed', () => {
    render(<DeleteAllModal type="completed" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /delete all completed tasks/i })).toBeInTheDocument();
  });
});

describe('DeleteAllModal — buttons', () => {
  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn();
    render(<DeleteAllModal type="active" onConfirm={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onConfirm when Delete is clicked', async () => {
    const onConfirm = vi.fn();
    render(<DeleteAllModal type="active" onConfirm={onConfirm} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('does not call onConfirm when Cancel is clicked', async () => {
    const onConfirm = vi.fn();
    render(<DeleteAllModal type="active" onConfirm={onConfirm} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});