import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

function Menu() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const rooms = useSelector((store) => store.rooms);
  let [enterRoomID, setEnterRoomID] = useState('');

  const gameObject = {
    player: user.id,
    roomID: enterRoomID
  }

  let checkedRoom = true;

  function checkRooms() {
    for(let room of rooms) {
      if (enterRoomID === room.room_id) {
        checkedRoom = false;
        return console.log('room exists');
      } 
    }
    console.log(checkedRoom);
  }

  useEffect(() => {
    checkRooms()
  }, [enterRoomID])

  function joinRoomBtn() {
    dispatch({type: 'FETCH_ROOMS'});
    console.log(rooms);
    for(let room of rooms) {
      if (room.room_id === enterRoomID && room.black == null) {
        axios.put('/api/game/secondplayer', gameObject).then((response) => {
          dispatch({type: 'FETCH_ROOMS'})
        }).catch(error => {
          console.log('Error in PUT /secondplayer', error);
        })
        return console.log('added second player');
      } else if(room.room_id === enterRoomID && room.black) {
          alert('This room is full');
          return;
      } else if (checkedRoom) {
        axios.post('/api/game/firstplayer', gameObject).then((response) => {
          dispatch({type: 'FETCH_ROOMS'})
        }).catch(error => {
          console.log('Error in POST /firstplayer', error);
        })
        return console.log('added room');
      }
    }

    
  }

  return (
    <div className="container">
      <input onChange={(e) => {setEnterRoomID(e.target.value)}}/> 
      <button onClick={joinRoomBtn}>Join Room</button>
    </div>
  );
}

export default Menu;
