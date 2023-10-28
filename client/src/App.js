import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './components/login';
import Dashboard from './components/Dashboard';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState()
  useEffect(() => {
    let token = localStorage.getItem('task_board_token');
    setToken(token);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={token ? <Dashboard /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
