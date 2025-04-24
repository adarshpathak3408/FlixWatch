import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaCheck } from 'react-icons/fa';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useAuth } from '../../contexts/AuthContext';

const SubscriptionModal = ({ isOpen, onClose, movieId }) => {
  const { user } = useAuth();
  const { isSubscriptionActive, createSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      amount: 100, // ₹1 (in paise)
      currency: 'INR',
      features: ['Access to all premium content', 'Basic support', '30 days validity'],
      bestValue: false
    },
    {
      id: 'standard',
      name: 'Standard',
      amount: 200, // ₹2 (in paise)
      currency: 'INR',
      features: ['Access to all premium content', 'Priority support', '30 days validity', 'HD streaming'],
      bestValue: true
    },
    {
      id: 'premium',
      name: 'Premium',
      amount: 300, // ₹3 (in paise)
      currency: 'INR',
      features: ['Access to all premium content', '24/7 support', '30 days validity', '4K streaming', 'Early access'],
      bestValue: false
    }
  ];

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(window.Razorpay);
      };
      script.onerror = () => {
        resolve(null);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    if (!user) return;

    setIsProcessing(true);

    try {
      // First load Razorpay
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        throw new Error('Failed to load Razorpay');
      }

      // Create order on your backend (in a real app, you'd call your backend API here)
      // For demo purposes, we'll use the frontend directly with test keys
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: selectedPlan.amount,
        currency: selectedPlan.currency,
        name: 'TrailerHub Premium',
        description: `${selectedPlan.name} Subscription`,
        image: 'https://via.placeholder.com/150',
        order_id: `order_${Date.now()}_${user.id.substring(0, 8)}`, // In production, generate this on your backend
        handler: async (response) => {
          // Handle successful payment
          try {
            await createSubscription(selectedPlan, response.razorpay_payment_id);
            onClose();
          } catch (error) {
            console.error('Error creating subscription:', error);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.user_metadata?.name || '',
          email: user.email,
        },
        theme: {
          color: '#6366f1',
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl bg-dark-300 rounded-xl overflow-hidden shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6 border-b border-dark-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaCrown className="text-yellow-400" />
                Upgrade to Premium
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-dark-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-300 mb-6">
                To access premium content, please choose a subscription plan that works for you.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`relative p-6 rounded-lg border cursor-pointer transition-all ${
                      selectedPlan?.id === plan.id
                        ? 'border-primary-500 bg-dark-400'
                        : 'border-dark-100 hover:border-primary-400'
                    } ${plan.bestValue ? 'ring-2 ring-yellow-500' : ''}`}
                  >
                    {plan.bestValue && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full">
                        BEST VALUE
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-end mb-4">
                      <span className="text-3xl font-bold">₹{plan.amount / 100}</span>
                      <span className="text-gray-400 ml-1">/month</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <FaCheck className="text-green-400 mt-1 mr-2 flex-shrink-0" size={14} />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="btn btn-ghost border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!selectedPlan || isProcessing}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCrown />
                      Upgrade Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;