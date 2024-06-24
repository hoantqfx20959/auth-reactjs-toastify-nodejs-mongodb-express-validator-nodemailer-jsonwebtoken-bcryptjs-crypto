import { useEffect, useState } from 'react';
import {
  useNavigate,
  useSearchParams,
  Link,
  useLocation,
  useParams,
} from 'react-router-dom';
import { generateToast, ToastContent } from '../../UI/Toast/Toast';
import useFetch from '../../../untils/use-fetch';

import PageContent from '../../UI/PageContent/PageContent';

import stles from './AuthForm.module.css';

const maxAge = 24 * 60 * 60 * 1000;

const Auth = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [navigate, token]);

  const isResetPass = location.pathname === '/reset-password';
  const isNewPass = location.pathname.includes(`/new-password/`);

  const [
    searchParams,
    // setSearchParams
  ] = useSearchParams();
  const isRegister = searchParams.get('mode') === 'register';
  const isLogin = searchParams.get('mode') === 'login';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const [resetPass, setResetPass] = useState();

  const { fetchUrl: fetchData } = useFetch();
  useEffect(() => {
    if (params.token) {
      fetchData({ url: `/new-password/${params.token}` }, data => {
        setResetPass(data);
      });
    }
  }, [fetchData, params.token]);

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await fetchData(
        {
          url: `/${
            isNewPass
              ? 'new-password'
              : isResetPass
              ? 'reset'
              : isRegister
              ? 'signup'
              : 'login'
          }`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            userId: isNewPass ? resetPass.userId : '',
            passwordToken: isNewPass ? resetPass.passwordToken : '',
            isClient: true,
            isAdviser: false,
            isAdmin: false,
          }),
        },
        data => {
          if (data) {
            if (data.errorMessage) {
              generateToast(data.errorMessage);
            } else if (data.errors) {
              generateToast('incorrect username or password');
            } else {
              if (isLogin) {
                const expiryDate = new Date(new Date().getTime() + maxAge);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('expiryDate', expiryDate.toISOString());
              }
              isRegister
                ? navigate('/auth?mode=login')
                : (window.location = '/');
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageContent className={stles.pageContent}>
      <form onSubmit={handleSubmit} className={stles.form}>
        {!isNewPass && (
          <div className={stles.formItem}>
            <label>User Name</label>
            <input
              type='text'
              name='username'
              placeholder='User Name'
              onChange={e => setUsername(e.target.value)}
              value={username}
            />
          </div>
        )}
        {!isResetPass && (
          <div className={stles.formItem}>
            <label>Password</label>
            <input
              type='password'
              name='password'
              placeholder='Password'
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
          </div>
        )}
        {!isResetPass && isRegister && (
          <div className={stles.formItem}>
            <label>Full Name</label>
            <input
              type='text'
              name='fullName'
              placeholder='Full Name'
              onChange={e => setFullName(e.target.value)}
              value={fullName}
            />
          </div>
        )}
        {!isResetPass && isRegister && (
          <div className={stles.formItem}>
            <label>Phone Number</label>
            <input
              type='number'
              name='phoneNumber'
              placeholder='Phone Number'
              onChange={e => setPhoneNumber(e.target.value)}
              value={phoneNumber}
            />
          </div>
        )}
        {!isResetPass && isRegister && (
          <div className={stles.formItem}>
            <label>Email</label>
            <input
              type='email'
              name='email'
              placeholder='Email'
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>
        )}
        <div className={stles.formItem}>
          <button>
            {isNewPass
              ? 'Update'
              : isResetPass
              ? 'Reset Password'
              : isRegister
              ? 'Register'
              : 'Login'}
          </button>
          {!isNewPass && !isResetPass && !isRegister && (
            <Link to={`/reset-password`} style={{ textAlign: 'center' }}>
              Reset Password
            </Link>
          )}
        </div>
      </form>
      <ToastContent />
    </PageContent>
  );
};

export default Auth;
