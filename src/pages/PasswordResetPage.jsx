import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../services/authService';

export function PasswordResetPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('request'); // request or check-email
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const handleRequestReset = async values => {
    setError('');
    setIsSubmitting(true);

    try {
      await requestPasswordReset(values.email);
      setStep('check-email');
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error || 'Could not send reset email. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit(handleRequestReset)}>
        {step === 'request' ? (
          <>
            <h1 style={{ marginTop: 0 }}>Reset Password</h1>
            <p className="muted">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div className="field">
              <label>Email *</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>
            {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}
            <button
              className="button"
              type="submit"
              style={{ width: '100%', marginTop: 18 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button
                type="button"
                className="button-link"
                onClick={() => navigate('/login')}
                style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Back to Login
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ marginTop: 0 }}>Check Your Email</h1>
            <p className="muted">
              A password reset link has been sent to {watch('email')}. Check your email and click the link to reset your password.
            </p>
            <div style={{ 
              background: '#ecfdf5', 
              border: '1px solid #86efac', 
              borderRadius: 12, 
              padding: 16,
              marginTop: 24,
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#15803d', fontWeight: 500 }}>
                ✓ Email sent successfully
              </p>
            </div>
            <p className="muted" style={{ marginTop: 24, fontSize: '0.9rem' }}>
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              type="button"
              className="button"
              onClick={() => setStep('request')}
              style={{ width: '100%', marginTop: 18 }}
            >
              Try Again
            </button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button
                type="button"
                className="button-link"
                onClick={() => navigate('/login')}
                style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
