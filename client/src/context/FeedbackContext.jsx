import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { updateUserSettings } from '../api/auth';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
	const [feedbackType, setFeedbackTypeState] = useState(
		localStorage.getItem('feedbackType') || 'toast'
	);
	const { user, loading } = useAuth();

	// Sync from DB once when user data loads
	useEffect(() => {
		if (loading || !user) return;
		const dbType = user.settings?.notificationType;
		if (dbType) {
			setFeedbackTypeState(dbType);
			localStorage.setItem('feedbackType', dbType);
		}
	}, [loading, user?.id]);

	const setFeedbackType = (newType) => {
		setFeedbackTypeState(newType);
		localStorage.setItem('feedbackType', newType);
		if (user) {
			updateUserSettings({ notificationType: newType }).catch(() => {});
		}
	};

	return (
		<FeedbackContext.Provider value={{ feedbackType, setFeedbackType }}>
			{children}
		</FeedbackContext.Provider>
	);
};

export const useFeedback = () => useContext(FeedbackContext);
