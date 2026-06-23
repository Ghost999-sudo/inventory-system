import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { login, registerUser } from '../services/authService';
import { ROLES, formatRole, roleOptions } from '../auth/roles';

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: ROLES.CASHIER
    }
  });

  const switchMode = nextMode => {
    setMode(nextMode);
    setError('');
    setMessage('');
    reset({ fullName: '', email: '', password: '', role: ROLES.CASHIER });
  };

  const onSubmit = async values => {
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'request') {
        const response = await registerUser({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: values.role
        });
        setMessage(`${response.fullName}, your ${formatRole(response.role)} account request is pending admin approval.`);
        reset({ fullName: '', email: '', password: '', role: ROLES.CASHIER });
      } else {
        const response = await login({ email: values.email, password: values.password });
        dispatch(loginSuccess(response));
        navigate('/dashboard');
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error || 'Authentication failed. Check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <h1 style={{ marginTop: 0 }}>{mode === 'request' ? 'Request account' : 'Welcome back'}</h1>
        <p className="muted">
          {mode === 'request'
            ? 'Employees can request access. A Super Admin or Business Admin must approve the account before login.'
            : 'Sign in with an approved internal staff account to manage inventory, sales, and reports.'}
        </p>
        <div className="auth-switch">
          <button className={`button ${mode === 'login' ? '' : 'secondary'}`} type="button" onClick={() => switchMode('login')}>
            Login
          </button>
          <button className={`button ${mode === 'request' ? '' : 'secondary'}`} type="button" onClick={() => switchMode('request')}>
            Request Access
          </button>
        </div>
        {mode === 'request' ? (
          <>
            <div className="field" style={{ marginTop: 12 }}>
              <label>Full Name</label>
              <input {...register('fullName', { required: mode === 'request' })} autoComplete="name" />
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label>Requested Role</label>
              <select {...register('role', { required: mode === 'request' })}>
                {roleOptions.filter(role => role !== ROLES.SUPER_ADMIN).map(role => (
                  <option key={role} value={role}>
                    {formatRole(role)}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}
        <div className="field" style={{ marginTop: 12 }}>
          <label>Email</label>
          <input {...register('email', { required: true })} type="email" autoComplete="email" />
        </div>
        <div className="field" style={{ marginTop: 12 }}>
          <label>Password</label>
          <input {...register('password', { required: true })} type="password" autoComplete={mode === 'request' ? 'new-password' : 'current-password'} />
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="success-text">{message}</p> : null}
        <button className="button" type="submit" style={{ width: '100%', marginTop: 18 }} disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : mode === 'request' ? 'Submit Request' : 'Login'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            className="button-link"
            onClick={() => switchMode(mode === 'request' ? 'login' : 'request')}
            style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.95rem' }}
          >
            {mode === 'request' ? 'Already have an account? Login' : 'Create a new account'}
          </button>
        </div>
        {mode === 'login' && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <a href="/password-reset" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.9rem' }}>
              Forgot password?
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
