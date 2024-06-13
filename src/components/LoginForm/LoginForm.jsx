import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {useSelector} from 'react-redux';
import { Button, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';

// To change the color of the button
const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = createTheme({
  palette: {
      main: createColor('#00acb0'),
  },
});

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(store => store.errors);
  const dispatch = useDispatch();

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

  const buttonStyle = {
    color: 'white',
    height: '55px',
  };

  const inputStyle = {
    margin: '5px',
  }

  return (
    <form className="formPanel" onSubmit={login}>
      <h2>Login</h2>
      {errors.loginMessage && (
        <h3 className="alert" role="alert">
          {errors.loginMessage}
        </h3>
      )}
      <ThemeProvider theme={theme}>
      <div>
          <TextField
            type="text"
            name="username"
            label='Username'
            style={inputStyle}
            InputLabelProps={{style: { color: '#00acb0' },}}
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
      </div>
      <div>
          <TextField
            type="password"
            name="password"
            label="Password"
            style={inputStyle}
            InputLabelProps={{style: { color: '#00acb0' },}}
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
      </div>
      <div>
        <Button 
          color='main'
          variant='contained' 
          className="btn" 
          type="submit" 
          name="submit"
          style={buttonStyle} 
          >Login</Button>
        
      </div>
      </ThemeProvider>
    </form>
  );
}

export default LoginForm;
