/**
 * OAuth Callback Handler
 * Processes Google OAuth callback and redirects to dashboard
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { handleCallback } = useAuthStore();
    const [status, setStatus] = useState('processing'); // processing, success, error
    const [error, setError] = useState(null);

    useEffect(() => {
        const processCallback = async () => {
            try {
                await handleCallback();
                setStatus('success');

                // Redirect to dashboard after brief delay
                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 1500);
            } catch (err) {
                console.error('Callback error:', err);
                setStatus('error');
                setError(err.message || 'Authentication failed');

                // Redirect to login after delay
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
            }
        };

        processCallback();
    }, [handleCallback, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center"
            >
                {status === 'processing' && (
                    <>
                        <Loader2 className="w-16 h-16 text-indigo-600 mx-auto mb-6 animate-spin" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Completing sign in...
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we set up your account
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Success!
                        </h2>
                        <p className="text-gray-600">
                            Redirecting to your dashboard...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Authentication Failed
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {error || 'Something went wrong'}
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting to login...
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default AuthCallback;
