import { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import useFetch from '../../../untils/use-fetch';

import PageContent from '../../UI/PageContent/PageContent';

import styles from './Home.module.css';

function HomePage() {
  const { fetchUrl: fetchData } = useFetch();

  const token = localStorage.token;

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

  return (
    <PageContent>
      <Row>
        {currentUser && (
          <Col className='col-12 text-center'>
            <h4>Wellcome to my Website, </h4>
            <h2>{currentUser.fullName}</h2>
            <h6>Wishing you a fun and happy day!</h6>
          </Col>
        )}
      </Row>
    </PageContent>
  );
}

export default HomePage;
