import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from "chess.js";
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

// To change the color of the button
const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = createTheme({
  palette: {
      main: createColor('#00acb0'),
  },
});

function LandingPage() {
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  const buttonStyle = {
    color: 'white',
  }

  const [game, setGame] = useState(new Chess());

  function makeAMove(move) {
    try {
    game.move(move);
    setGame(new Chess(game.fen()))
    } catch(error) {
      console.log('error making random move', error)
    }
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", 
    });

    // illegal move
    setTimeout(makeRandomMove, 200);
    return true;
  }

  return (
    <div className="container">

      <div className="grid">
        <div className="grid-col grid-col_8">
          <h2>
            Welcome to Full Stack Chess!
          </h2> 
          <div className="chessGrid">
            <div className="board">
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                customDarkSquareStyle={{backgroundColor: '#4b464f'}}
                customLightSquareStyle={{backgroundColor: '#d9d9d9'}}
              />
            </div>
          </div>         
        </div>
        <div className="grid-col grid-col_4">
          <RegisterForm />

          <center>
            <h4>Already a Member?</h4>
            <ThemeProvider theme={theme}>
            <Button variant="contained" color="main" style={buttonStyle} className="btn btn_sizeSm" onClick={onLogin}>
              Login</Button>
            </ThemeProvider>
          </center>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
