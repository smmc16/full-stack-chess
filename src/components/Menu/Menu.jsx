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

  let checkedRoom = '';

  function checkRooms() {
    for(let room of rooms) {
      if (enterRoomID === room.room_id) {
        checkedRoom = false;
        console.log('room exists');
        return;
      } else { 
        checkedRoom = true;
        console.log('room doesnt exist');
      }
    }
    console.log(checkedRoom);
  }

  useEffect(() => {
    dispatch({type: 'FETCH_ROOMS'})
    checkRooms()
  }, [enterRoomID])

  function joinRoomBtn() {
    dispatch({type: 'FETCH_ROOMS'});
    console.log(rooms);
    for(let room of rooms) {
      if (room.room_id === enterRoomID && room.black === null) {
        axios.put('/api/game/secondplayer', gameObject).then((response) => {
          console.log('added second player')
        }).catch(error => {
          console.log('Error in PUT /secondplayer', error);
        })
        return;
      } else if(room.room_id === enterRoomID && room.black) {
          alert('This room is full');
          return;
      } else if (checkedRoom) {
        axios.post('/api/game/firstplayer', gameObject).then((response) => {
          console.log('added room')
        }).catch(error => {
          console.log('Error in POST /firstplayer', error);
        })
        return;
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
