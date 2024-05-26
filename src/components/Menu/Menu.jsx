import React, { useState } from 'react';
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

  function checkRooms() {
    for(let room of rooms) {
      if (enterRoomID === rooms.room_id) {
        return false
      }
    }
    return true;
  }

  function joinRoomBtn() {
    dispatch({type: 'FETCH_ROOMS'})
    console.log(rooms)

    for(let room of rooms) {
      if (room.room_id === enterRoomID && room.black === null) {
        axios.put('/api/game/secondplayer', gameObject).then((response) => {

        }).catch(error => {
          console.log('Error in PUT /secondplayer', error);
        })
      } else if(room.room_id === enterRoomID && room.black) {
          alert('This room is full');
      } else if (checkRooms) {
        axios.post('/api/game/firstplayer', gameObject).then((response) => {

        }).catch(error => {
          console.log('Error in POST /firstplayer', error);
        })
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
