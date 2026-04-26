import { useFeedback } from '../context/FeedbackContext';
import { addToast } from '../components/Toasts';
import type { ToastType } from '../types';

export const useFeedbackHandler = () => {
  const { feedbackType } = useFeedback();

  const handleFeedback = (
    type: ToastType,
    message: string,
    setInline: (msg: string) => void
  ): void => {
    if (feedbackType === 'toast') {
      addToast(type, message);
    } else {
      setInline(message);

      setTimeout(() => {
        setInline('');
      }, 5000);
    }
  };

  return { handleFeedback };
};
