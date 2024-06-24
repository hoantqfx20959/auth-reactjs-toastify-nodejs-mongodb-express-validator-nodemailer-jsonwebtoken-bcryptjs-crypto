import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'reactstrap';

import Navbar from './components/UI/Navbar/Navbar';
import Home from './components/page/Home/Home';
import Auth from './components/page/Auth/AuthForm';

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/reset-password' element={<Auth />} />
          <Route path='/new-password/:token' element={<Auth />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
