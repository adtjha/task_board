import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      axios({
        method: "post",
        url: "http://localhost:5000/login",
        data: {
          username,
          password,
        },
      })
        .then((e) => {
          console.log(e.data);
          localStorage.setItem("task_board_token", e.data);
          window.location.reload();
        })
        .catch((e) => {
          alert(e);
        });
      console.log({ username, password });
    } else {
      alert("Please fill in all the fields.");
    }
  };

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  return (
    <>
      <h2>Login</h2>
      <form className='form' onSubmit={handleLogin}>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Login</button>
      </form>
    </>
  );
};

export default Login;
