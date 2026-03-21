import { createContext, useContext, useState, useEffect } from 'react';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
	const [feedbackType, setFeedbackType] = useState(
		localStorage.getItem('feedbackType') || 'toast'
	);

	useEffect(() => {
		localStorage.setItem('feedbackType', feedbackType);
	}, [feedbackType]);

	return (
		<FeedbackContext.Provider value={{ feedbackType, setFeedbackType }}>
			{children}
		</FeedbackContext.Provider>
	);
};

export const useFeedback = () => useContext(FeedbackContext);