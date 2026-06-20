import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/slices/authSlice';
import { useForm } from 'react-hook-form';

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: 'admin@store.com',
      password: 'admin123'
    }
  });

  const onSubmit = values => {
    dispatch(
      loginSuccess({
        user: { name: 'Admin User', email: values.email, role: 'Manager' },
        token: 'demo-token'
      })
    );
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <h1 style={{ marginTop: 0 }}>Welcome back</h1>
        <p className="muted">Sign in to manage inventory, sales, and reports.</p>
        <div className="field">
          <label>Email</label>
          <input {...register('email')} type="email" />
        </div>
        <div className="field" style={{ marginTop: 12 }}>
          <label>Password</label>
          <input {...register('password')} type="password" />
        </div>
        <button className="button" type="submit" style={{ width: '100%', marginTop: 18 }}>
          Login
        </button>
      </form>
    </div>
  );
}
