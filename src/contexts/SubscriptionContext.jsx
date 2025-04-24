import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (planData, paymentId) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: user.id,
          plan_id: planData.id,
          plan_name: planData.name,
          amount: planData.amount,
          currency: planData.currency,
          payment_id: paymentId,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        }])
        .select()
        .single();

      if (!error && data) {
        setSubscription(data);
        return data;
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  };

  const isSubscriptionActive = () => {
    if (!subscription) return false;
    return new Date(subscription.end_date) > new Date();
  };

  const value = {
    subscription,
    loading,
    isSubscriptionActive,
    createSubscription,
    fetchSubscription
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};