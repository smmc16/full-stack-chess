import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider, makeStyles } from '@mui/material';
import { Chessboard } from 'react-chessboard';
import './Menu.css';

function Menu() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((store) => store.user);
  const rooms = useSelector((store) => store.rooms);
  let [enterRoomID, setEnterRoomID] = useState('');

// Sent to the server on room join
  const gameObject = {
    player: user.id,
    roomID: enterRoomID
  }

// Store whether enterRoomID already exists
  let checkedRoom = true;

// Check if a room exists
  function checkRooms() {
    for(let room of rooms) {
      if (enterRoomID === room.room_id) {
        checkedRoom = false;
        return console.log('room exists');
      } 
    }
    console.log(checkedRoom);
  }

// Update the rooms store
  useEffect(() => {
    dispatch({type: 'FETCH_ROOMS'});
    getUserRooms();
  }, [])

// Check enterRoomID everytime it changes
  useEffect(() => {
    checkRooms()
  }, [enterRoomID])

  function joinRoomBtn() {
    dispatch({type: 'FETCH_ROOMS'});
    console.log(rooms);
    for(let room of rooms) {
      // If a room exists and has no second player, update the db to add the second player
      if (room.room_id === enterRoomID && room.white == null) {
        axios.put('/api/game/secondplayer', gameObject).then((response) => {
          dispatch({type: 'FETCH_ROOMS'})
          getUserRooms();
        }).catch(error => {
          console.log('Error in PUT /secondplayer', error);
        })
        console.log('added second player');
        return setEnterRoomID('');
      } 
      // Checking if a second player is already in the room
      else if(room.room_id === enterRoomID && room.white) {
          alert('This room is full');
          return setEnterRoomID('');
      } 
      // Makes sure enterRoomID isnt an empty string
      else if (enterRoomID.trim().length == 0) {
        alert('Please enter a room id')
        return setEnterRoomID('');
      } 
      // Adds the room to the db if it doesnt exist
      else if (checkedRoom) {
        axios.post('/api/game/firstplayer', gameObject).then((response) => {
          dispatch({type: 'FETCH_ROOMS'})
          getUserRooms();
        }).catch(error => {
          console.log('Error in POST /firstplayer', error);
        })
        console.log('added room')
        return setEnterRoomID('');
      }
    }  
  }

  // Gets specific rooms that the user is in
  let [userRooms, setUserRooms] = useState([]);
  function getUserRooms() {
    axios.get(`/api/game/userRooms/${user.id}`).then((response) => {
      setUserRooms(response.data);
      console.log(userRooms)
    }).catch(error => {
      console.log('Error in GET /userRooms', error);
    })
  }

  // Pushes user to the game page at the correct id
  function roomBtn(id) {
    history.push(`/game/${id}`)
  }

  // Notifies user if it's their turn
  function turnNotice(room) {
    if(user.id === room.white && room.turn == 'w') {
      return `It's your turn!`
    } else if(user.id === room.black && room.turn == 'b') {
      return `It's your turn!`
    }
  }

  const { palette } = createTheme();
  const { augmentColor } = palette;
  const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

  const theme = createTheme({
    palette: {
        main: createColor('#00acb0'),
    },
  });

    const buttonStyle = {
      color: 'white',
      height: '55px',
    }

    const stackStyle = {
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
    }

  return (
    <div className="container">
      <div id='form'>
      <ThemeProvider theme={theme}>
        <form onSubmit={joinRoomBtn}>
          <Stack direction="row" style={stackStyle}>
            <TextField value={enterRoomID} label="Room ID" onChange={(e) => {setEnterRoomID(e.target.value)}}/> 
            <Button type='submit' variant='contained' color="main" style={buttonStyle}>Join Room</Button>
          </Stack>
        </form>
      </ThemeProvider>
      </div>
      <div id='rooms'>
      {userRooms.map((room) => 
        <Card onClick={() => roomBtn(room.id)} className='room' key={room.id}>
          <CardContent>
            <Chessboard 
              position={room.position} 
              boardWidth={100} 
              arePiecesDraggable={false}
              boardOrientation={user.id === room.white ? 'white' : 'black'} 
            />
            <h4>{room.room_id}</h4>
            <p>{turnNotice(room)}</p>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}

export default Menu;
