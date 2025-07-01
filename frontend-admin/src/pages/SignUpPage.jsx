import React, { useEffect, useState } from 'react';
import style from '../styles/SignupPage.module.css';
import { adminLogin, adminSignup, getAdminDetails } from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignUpPage() {
  const [op, setOP] = useState('login');
  const navigate = useNavigate();
  const { setAdmin } = useAuth(); // Get setAdmin from context

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleloginChange = (e) => {
    setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupChange = (e) => {
    setSignupData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSigup = async () => {
    try {
      const { firstName, lastName, email, password, confirmPassword } = signupData;

      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        toast.error("Please fill all the fields");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const response = await adminSignup(signupData);
      toast.success(response.data.message);
      setOP('login');
    } catch (error) {
      console.log('Signup error:', error);
      toast.error('Signup failed');
    }
  };

  const handleLogin = async () => {
    try {
      const { email, password } = loginData;
      if (!email.trim() || !password.trim()) {
        toast.error("Please fill all the fields");
        return;
      }

      await adminLogin(loginData); // log in and set cookie
      const res = await getAdminDetails(); 
      // fetch admin details
      console.log(res.data.admin)
      setAdmin(res.data.admin); // update context
      toast.success('Login successful');
      navigate('/dashboard'); // redirect
    } catch (error) {
      console.log('Login error:', error);
      toast.error('Login failed');
    }
  };

  useEffect(() => {
    setLoginData({ email: '', password: '' });
    setSignupData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  }, [op]);

  return (
    <div className={style.main}>
      {op === 'login' ? (
        <>
          <input
            name='email'
            value={loginData.email}
            onChange={handleloginChange}
            className={style.input}
            type='email'
            placeholder='Email'
          />
          <input
            name='password'
            value={loginData.password}
            onChange={handleloginChange}
            className={style.input}
            type='password'
            placeholder='Password'
          />
          <button onClick={handleLogin} className={style.button}>
            Login
          </button>
        </>
      ) : (
        <>
          <input
            name='firstName'
            value={signupData.firstName}
            onChange={handleSignupChange}
            className={style.input}
            placeholder='First name'
            type='text'
          />
          <input
            name='lastName'
            value={signupData.lastName}
            onChange={handleSignupChange}
            className={style.input}
            placeholder='Last name'
            type='text'
          />
          <input
            name='email'
            value={signupData.email}
            onChange={handleSignupChange}
            className={style.input}
            placeholder='Email'
            type='email'
          />
          <input
            name='password'
            value={signupData.password}
            onChange={handleSignupChange}
            className={style.input}
            placeholder='Password'
            type='password'
          />
          <input
            name='confirmPassword'
            value={signupData.confirmPassword}
            onChange={handleSignupChange}
            className={style.input}
            placeholder='Confirm password'
            type='password'
          />
          <button onClick={handleSigup} className={style.button}>
            Sign up
          </button>
        </>
      )}
      <button
        className={style.link}
        onClick={() => setOP(prev => (prev === 'login' ? 'signup' : 'login'))}
      >
        {op === 'login' ? 'New here? Signup' : 'Already have an account? Login'}
      </button>
    </div>
  );
}

export default SignUpPage;
