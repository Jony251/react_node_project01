import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import styles from './login.module.css';
import ErrorPopup from '../ErrorPopup/ErrorPopup';
import CustomInput from '../common/CustomInput/CustomInput';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login, register, googleLogin } = useAuth();

  const [mode, setMode]         = useState('login'); // 'login' | 'register'
  const [role, setRole]         = useState('child'); // 'child' | 'parent'
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors]     = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === 'login';

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value.trim() }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Password is required';
    if (!isLogin) {
      if (!formData.username) e.username = 'Username is required';
      else if (formData.username.length < 2) e.username = 'At least 2 characters';
      if (formData.password.length < 6) e.password = 'At least 6 characters';
      if (!formData.confirmPassword) e.confirmPassword = 'Please confirm';
      else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        const r = await login(formData.email, formData.password);
        if (r.success) navigate('/');
        else setErrors({ submit: r.message });
      } else {
        await register(formData.username, formData.email, formData.password, role);
        navigate('/');
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async ({ credential }) => {
    const r = await googleLogin(credential);
    if (r.success) navigate('/');
    else setErrors({ submit: r.message });
  };

  const toggleMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>🎮</div>
        <h1 className={styles.title}>{isLogin ? 'Welcome Back!' : 'Join FunZone!'}</h1>
        <p className={styles.subtitle}>
          {isLogin ? 'Log in to start playing!' : 'Create your account to play!'}
        </p>

        {/* Google Sign-In */}
        <div className={styles.googleWrap}>
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setErrors({ submit: 'Google login failed' })}
            size="large"
            shape="pill"
            text={isLogin ? 'signin_with' : 'signup_with'}
            locale="en"
          />
        </div>

        <div className={styles.divider}><span>or</span></div>

        {/* Role selector – only shown on register */}
        {!isLogin && (
          <div className={styles.roleRow}>
            {['child', 'parent'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`${styles.roleBtn} ${role === r ? styles.roleActive : ''}`}
              >
                {r === 'child' ? '👶 Child' : '👨‍👩‍👧 Parent'}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <CustomInput
              type="text" id="username" name="username"
              value={formData.username} onChange={handleChange}
              label="Username" placeholder="Your name"
              error={errors.username} required
            />
          )}
          <CustomInput
            type="email" id="email" name="email"
            value={formData.email} onChange={handleChange}
            label="Email" placeholder="you@example.com"
            error={errors.email} required
          />
          <CustomInput
            type="password" id="password" name="password"
            value={formData.password} onChange={handleChange}
            label="Password" placeholder="Min 6 characters"
            error={errors.password} required
          />
          {!isLogin && (
            <CustomInput
              type="password" id="confirmPassword" name="confirmPassword"
              value={formData.confirmPassword} onChange={handleChange}
              label="Confirm Password" placeholder="Repeat password"
              error={errors.confirmPassword} required
            />
          )}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading
              ? (isLogin ? 'Logging in…' : 'Creating account…')
              : (isLogin ? '🚀 Log In' : '🎉 Create Account')}
          </button>

          <div className={styles.togglePrompt}>
            <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
            <button type="button" onClick={toggleMode} className={styles.toggleLink}>
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </form>
      </div>

      <ErrorPopup message={errors.submit} onClose={() => setErrors(p => ({ ...p, submit: '' }))} />
    </div>
  );
}

export default Login;
