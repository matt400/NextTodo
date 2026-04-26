import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFeedbackHandler } from '../useFeedbackHandler';

// Mock the two modules the hook depends on
vi.mock('../../context/FeedbackContext', () => ({
  useFeedback: vi.fn(),
}));

vi.mock('../../components/Toasts', () => ({
  addToast: vi.fn(),
}));

import { useFeedback } from '../../context/FeedbackContext';
import { addToast } from '../../components/Toasts';

const mockUseFeedback = vi.mocked(useFeedback);
const mockAddToast = vi.mocked(addToast);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useFeedbackHandler — toast mode', () => {
  beforeEach(() => {
    mockUseFeedback.mockReturnValue({
      feedbackType: 'toast',
      setFeedbackType: vi.fn(),
    });
  });

  it('calls addToast with the correct type and message', () => {
    const { result } = renderHook(() => useFeedbackHandler());
    result.current.handleFeedback('success', 'Task added', vi.fn());
    expect(mockAddToast).toHaveBeenCalledWith('success', 'Task added');
  });

  it('does not call setInline', () => {
    const { result } = renderHook(() => useFeedbackHandler());
    const setInline = vi.fn();
    result.current.handleFeedback('error', 'Something went wrong', setInline);
    expect(setInline).not.toHaveBeenCalled();
  });
});

describe('useFeedbackHandler — inline mode', () => {
  beforeEach(() => {
    mockUseFeedback.mockReturnValue({
      feedbackType: 'inline',
      setFeedbackType: vi.fn(),
    });
  });

  it('calls setInline with the message', () => {
    const { result } = renderHook(() => useFeedbackHandler());
    const setInline = vi.fn();
    result.current.handleFeedback('success', 'Task added', setInline);
    expect(setInline).toHaveBeenCalledWith('Task added');
  });

  it('does not call addToast', () => {
    const { result } = renderHook(() => useFeedbackHandler());
    result.current.handleFeedback('success', 'Task added', vi.fn());
    expect(mockAddToast).not.toHaveBeenCalled();
  });

  it('clears the inline message after 5 seconds', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useFeedbackHandler());
    const setInline = vi.fn();

    result.current.handleFeedback('info', 'Saved', setInline);
    expect(setInline).toHaveBeenCalledWith('Saved');

    vi.advanceTimersByTime(5000);
    expect(setInline).toHaveBeenCalledWith('');

    vi.useRealTimers();
  });
});
