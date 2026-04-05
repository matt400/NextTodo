import { useFeedback } from '../context/FeedbackContext';
import { addToast } from '../components/Toasts';

export const useFeedbackHandler = () => {
	const { feedbackType } = useFeedback();

	const handleFeedback = (type, message, setInline) => {
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