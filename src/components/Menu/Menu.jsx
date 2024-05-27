import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

function Menu() {
  const dispatch = useDispatch();
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
  }, [])

// check enterRoomID everytime it changes
  useEffect(() => {
    checkRooms()
  }, [enterRoomID])

  function joinRoomBtn() {
    dispatch({type: 'FETCH_ROOMS'});
    console.log(rooms);
    for(let room of rooms) {
      // if a room exists and has no second player, update the db to add the ssecond player
      if (room.room_id === enterRoomID && room.black == null) {
        axios.put('/api/game/secondplayer', gameObject).then((response) => {
          dispatch({type: 'FETCH_ROOMS'})
        }).catch(error => {
          console.log('Error in PUT /secondplayer', error);
        })
        console.log('added second player');
        return setEnterRoomID('');
      } 
      // checking if a second player is already in the room
      else if(room.room_id === enterRoomID && room.black) {
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
        }).catch(error => {
          console.log('Error in POST /firstplayer', error);
        })
        console.log('added room')
        return setEnterRoomID('');
      }
    }
    
  }

  return (
    <div className="container">
      <input value={enterRoomID} onChange={(e) => {setEnterRoomID(e.target.value)}}/> 
      <button onClick={joinRoomBtn}>Join Room</button>

      
    </div>
  );
}

export default Menu;
