import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { createTheme, ThemeProvider } from '@mui/material';
import { Chessboard } from 'react-chessboard';
import './GameHistory.css';

// To change the color of the join room button
const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = createTheme({
  palette: {
      main: createColor('#00acb0'),
  },
});

function GameHistory() {
  const user = useSelector((store) => store.user);
  let [games, setGames] = useState()
  
  function getHistory() {
    axios.get(`/api/game/history/${user.id}`).then((response) => {
        setGames(response.data);
        console.log(response.data)
    }).catch((error) => {
        console.log('error in GET /game/history', error)
    })
  }
  
  useEffect(() => {
    getHistory();
  },[])

  function getOutcome (room) {
    if (room.outcome === "Black" && room.black === user.id) {
        return "You won!";
    } else if (room.outcome === "White" && room.white === user.id) {
        return "You won!";
    } else if (room.outcome === "Black" && room.white === user.id) {
        return "You lost";
    } else if (room.outcome === "White" && room.black === user.id) {
        return "You lost";
    } else {
        return room.outcome;
    }
  }


  return (
    <div className="container">
      <div id='games'>
      {games && games.map((room) => 
        <Card className='game' key={room.id}>
          <CardContent>
            <Chessboard 
              position={room.position} 
              boardWidth={100} 
              arePiecesDraggable={false}
              boardOrientation={user.id === room.white ? 'white' : 'black'}
              customDarkSquareStyle={{backgroundColor: '#6e6a72'}}
              customLightSquareStyle={{backgroundColor: '#d9d9d9'}} 
            />
            <h4>{room.room_id}</h4>
            <p>{getOutcome(room)}</p>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}

export default GameHistory;
