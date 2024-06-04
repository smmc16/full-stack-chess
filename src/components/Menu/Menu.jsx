import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Chessboard } from 'react-chessboard';
import './Menu.css';

function Menu({socket}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((store) => store.user);
  const rooms = useSelector((store) => store.rooms);
  let [enterRoomID, setEnterRoomID] = useState('');

// object to send to the server on room join
  const gameObject = {
    player: user.id,
    roomID: enterRoomID
  }

// variable to store whether enterRoomID already exists
  let checkedRoom = true;

// function to check if a room exists
  function checkRooms() {
    for(let room of rooms) {
      if (enterRoomID === room.room_id) {
        checkedRoom = false;
        return console.log('room exists');
      } 
    }
    console.log(checkedRoom);
  }

// useEffect to update the rooms store
  useEffect(() => {
    dispatch({type: 'FETCH_ROOMS'});
    getUserRooms();
  }, [])

// check enterRoomID everytime it changes
  useEffect(() => {
    checkRooms()
  }, [enterRoomID])

  function joinRoomBtn() {
    dispatch({type: 'FETCH_ROOMS'});
    console.log(rooms);
    for(let room of rooms) {
      // if a room exists and has no second player, update the db to add the second player
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
      // checking if a second player is already in the room
      else if(room.room_id === enterRoomID && room.white) {
          alert('This room is full');
          return setEnterRoomID('');
      } 
      // makes sure enterRoomID isnt an empty string
      else if (enterRoomID.trim().length == 0) {
        alert('Please enter a room id')
        return setEnterRoomID('');
      } 
      // adds the room to the db if it doesnt exist
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

  let [userRooms, setUserRooms] = useState([]);
  function getUserRooms() {
    axios.get(`/api/game/userRooms/${user.id}`).then((response) => {
      setUserRooms(response.data);
      console.log(userRooms)
    }).catch(error => {
      console.log('Error in GET /userRooms', error);
    })
  }

  function roomBtn(id) {
    history.push(`/game/${id}`)
    
  }

  function turnNotice(room) {
    if(user.id === room.white && room.turn == 'w') {
      return `It's your turn!`
    } else if(user.id === room.black && room.turn == 'b') {
      return `It's your turn!`
    }
  }

  return (
    <div className="container">
      <form onSubmit={joinRoomBtn}>
        <input value={enterRoomID} onChange={(e) => {setEnterRoomID(e.target.value)}}/> 
        <input type='submit' value='Join Room' />
      </form>
      <div id='rooms'>
      {userRooms.map((room) => 
        <Card onClick={() => roomBtn(room.id)} className='room' key={room.id}>
          <CardContent>
            <Chessboard 
            position={room.position} 
            boardWidth={100} 
            arePiecesDraggable={false}
            boardOrientation={user.id === room.white ? 'white' : 'black'} />
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
