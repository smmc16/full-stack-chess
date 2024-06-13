import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
      },
    });
  }; // end registerUser

  const buttonStyle = {
    color: 'white',
    height: '55px',
  };

  const inputStyle = {
    margin: '5px',
  }

  return (
    <form className="formPanel" onSubmit={registerUser}>
      <h2>Register User</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
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
          >Register</Button>
        
      </div>
      </ThemeProvider>
    </form>
  );
}

export default RegisterForm;
