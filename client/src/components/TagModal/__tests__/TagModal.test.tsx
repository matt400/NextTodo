import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagModal from '../TagModal';

function setup(tag?: { id: number; name: string; color: string }) {
  const onSave = vi.fn();
  const onClose = vi.fn();
  render(<TagModal tag={tag} onSave={onSave} onClose={onClose} />);
  return { onSave, onClose };
}

describe('TagModal — validation', () => {
  it('shows "Name is required" when submitting empty form', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('shows error for name longer than 30 characters', async () => {
    setup();
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'a'.repeat(31) } });
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByText(/30 characters or less/i)).toBeInTheDocument();
  });

  it('shows error when name contains spaces', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('Name'), 'my tag');
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByText(/cannot contain spaces/i)).toBeInTheDocument();
  });

  it('shows error when name starts with #', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('Name'), '#urgent');
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByText(/added automatically/i)).toBeInTheDocument();
  });

  it('shows error for special characters other than _ and -', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('Name'), 'tag@name');
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByText(/only letters/i)).toBeInTheDocument();
  });

  it('accepts underscores and hyphens', async () => {
    const { onSave } = setup();
    await userEvent.type(screen.getByLabelText('Name'), 'my_tag-name');
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onSave).toHaveBeenCalled();
  });

  it('clears error while typing a valid correction', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Name'), 'urgent');
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });
});

describe('TagModal — submission', () => {
  it('calls onSave with trimmed name and selected color', async () => {
    const { onSave } = setup();
    await userEvent.type(screen.getByLabelText('Name'), 'urgent');
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onSave).toHaveBeenCalledWith('urgent', expect.any(String));
  });

  it('does not call onSave when name is invalid', async () => {
    const { onSave } = setup();
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows "Save changes" button when editing an existing tag', () => {
    setup({ id: 1, name: 'urgent', color: '#ef4444' });
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('pre-fills name field when editing', () => {
    setup({ id: 1, name: 'urgent', color: '#ef4444' });
    expect(screen.getByLabelText('Name')).toHaveValue('urgent');
  });
});

describe('TagModal — close behavior', () => {
  it('calls onClose when Cancel is clicked', async () => {
    const { onClose } = setup();
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when X button is clicked', async () => {
    const { onClose } = setup();
    const closeBtn = screen.getAllByRole('button').find(
      (btn) => !btn.textContent?.includes('Create') && !btn.textContent?.includes('Cancel')
    )!;
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
