import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { updateUserSettings } from '../api/auth';
import type { FeedbackContextValue, FeedbackType } from '../types';

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export const FeedbackProvider = ({ children }: { children: React.ReactNode }) => {
  const [feedbackType, setFeedbackTypeState] = useState<FeedbackType>('toast');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
    const dbType = user.settings?.notificationType as FeedbackType | undefined;
    if (dbType) setFeedbackTypeState(dbType);
  }, [loading, user?.id]);

  const setFeedbackType = (newType: FeedbackType) => {
    setFeedbackTypeState(newType);
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

export const useFeedback = (): FeedbackContextValue => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
};
