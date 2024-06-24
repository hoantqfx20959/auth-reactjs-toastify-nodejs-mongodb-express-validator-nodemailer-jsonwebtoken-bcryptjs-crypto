import { useEffect, useState } from 'react';
import {
  useSearchParams,
  NavLink,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { Nav, NavItem, Row, Col } from 'reactstrap';
import useFetch from '../../../untils/use-fetch';

import styles from './Navbar.module.css';

// định hình cấu trúc navbar
const Navbar = () => {
  const [
    searchParams,
    // setSearchParams
  ] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = searchParams.get('mode') === 'login';
  const isRegister = searchParams.get('mode') === 'register';

  const isResetPass = location.pathname === '/reset-password';
  const isNewPass = location.pathname.includes(`/new-password/`);

  const { fetchUrl: fetchData } = useFetch();

  const token = localStorage.token;
  const userId = localStorage.userId;

  useEffect(() => {
    const token = localStorage.token;
    const expiryDate = localStorage.expiryDate;
    const maxAge = new Date(expiryDate).getTime() - new Date().getTime();

    const setAutoLogout = milliseconds => {
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('isClient');
        localStorage.removeItem('isAdmin');

        window.location = '/auth?mode=login';
      }, milliseconds);
    };

    const verifyUser = async () => {
      if (!token) {
        if (isRegister || isNewPass || isResetPass) {
          return;
        }
        navigate('/auth?mode=login');
      } else {
        setAutoLogout(maxAge);
        await fetchData(
          {
            url: `/check-user`,
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({}),
          },
          data => {
            if (!data.status) {
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              localStorage.removeItem('username');
              localStorage.removeItem('expiryDate');
              localStorage.removeItem('isClient');
              localStorage.removeItem('isAdmin');
            }
          }
        );
      }
    };
    verifyUser();
  }, [fetchData, isNewPass, isRegister, isResetPass, navigate, userId]);

  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    if (token)
      fetchData(
        {
          url: `/api/user`,
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
        data => {
          setCurrentUser(data);
          localStorage.setItem('username', data.username);
          localStorage.setItem('isClient', data.isClient);
          localStorage.setItem('isAdmin', data.isAdmin);
        }
      );
  }, [fetchData, token]);

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('isClient');
    localStorage.removeItem('isAdviser');
    localStorage.removeItem('isAdmin');

    window.location = '/auth?mode=login';
  };

  return (
    <Row className={styles.navbar}>
      <Col className='col-4'></Col>
      <Col className='col-4 text-center'>
        <h3>AUTH</h3>
      </Col>
      <Col className='col-4'>
        <Nav className={`${styles.list} ${styles.list2}`}>
          {!token && (
            <NavItem>
              <NavLink
                to={isLogin ? '/auth?mode=register' : '/auth?mode=login'}
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }>
                {isLogin ? 'Register' : 'Login'}
              </NavLink>
            </NavItem>
          )}
          {token && (
            <NavItem>
              <i className='fa-solid fa-user'></i>
              <span> {currentUser && currentUser.fullName}</span>
            </NavItem>
          )}
          {token && (
            <NavItem>
              <button className={styles.btn} onClick={logOut}>
                (Logout)
              </button>
            </NavItem>
          )}
        </Nav>
      </Col>
    </Row>
  );
};

export default Navbar;
