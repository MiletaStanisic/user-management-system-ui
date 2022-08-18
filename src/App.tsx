import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import Permissions from './pages/Permissions/Permissions';
import CreateUser from './pages/Users/CreateUser';
import EditUser from './pages/Users/EditUser';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/' element={<Home />} />
        <Route path='/user' element={<CreateUser />} />
        <Route path='/user/:userId' element={<EditUser />} />
        <Route path='/permissions/user/:userId' element={<Permissions />} />
      </Routes>
    </div>
  );
}

export default App;
