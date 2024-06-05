import React, { useState, useEffect } from 'react';
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import './ChessGame.css';
import Chat from '../Chat/Chat';

function ChessGame({socket}) {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user); 
  const room = useSelector(store => store.room);
  let [position, setPosition] = useState('start');
  let [game, setGame] = useState(new Chess());
  let [turn, setTurn] = useState();
  let [color, setColor] = useState('w')
  let [draggable, setDraggable] = useState(true);
  const { id } = useParams();
  const history = useHistory();
  let [didLoad, setDidLoad] = useState(false)

  useEffect(() => {
    socket.emit('joinRoom', id);
    dispatch({type: 'FETCH_ROOM', payload: id});
    
  }, [id]);

  // Update variables once the room saga has loaded
  useEffect(() => {
    console.log('HERE', room)
    if(room.id && room.id === Number(id)) {
      setPlayerColor();
      setPosition(room.position);
      setDidLoad(true);
      if(room.position !== 'start') {
        setGame(new Chess(room.position));
        console.log('set game', room.position);
      }
    
  }
  }, [room]);

  useEffect(() => {
    if(game) {
      setTurn(game.turn());
    }
  }, [game])

  // Sets player color from the database
  function setPlayerColor() {
    if(user.id === room.black) {
      setColor('b');
    } else if (user.id === room.white) {
      setColor('w');
    } else {
      setDraggable(false);
    }
  };

  // for onPieceDrop prop in chessboard, emits to makeMove socket
  function onDrop(sourceSquare, targetSquare) {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", 
    };
    try {
      game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });
          setGame(new Chess(game.fen()))
          setPosition(game.fen());
          putPosition();
          console.log(game.fen())
          socket.emit('makeMove', move, id);
          
          return console.log('valid move');
      } catch (error) { 
        return console.log('error making move in onDrop', error)}
        
  };

  // Controls whether the pieces are draggable based on whos turn it is
  function areDraggable () {
    console.log(color, turn)
    if(color == turn) {
        setDraggable(true)
    } else {
        setDraggable(false)
    }
  };

  useEffect(() => {
      areDraggable();
  }, [turn, color]);

  socket.on('makeMove', (m) => {
    try {
      game.move(m);
      setGame(new Chess(game.fen()));
      setPosition(game.fen());
      console.log('move made in socket');
    } catch (error) {
      console.log('error making move in socket', error)
    }
  });

  // Update database with new position and pgn
  function putPosition() {
    axios.put(`/api/game/position/${id}`, { position: game.fen(), turn: game.turn() }).then((response) => {
      console.log('position and turn updated in database')
      dispatch({type: 'FETCH_ROOM', payload: id});
    }).catch(error => {
      console.log('Error in PUT /position', error);
    })
  };
  
  return (
    <div id="page">
      {room.room_id ? <h2 id="roomID">{room.room_id}</h2> : <h2></h2>}
      {game && (
        <div id='board'>
          <Chessboard id={room.room_id}
          boardWidth={500}
          position={game.fen()} 
          onPieceDrop={onDrop}
          arePiecesDraggable={draggable}
          autoPromoteToQueen={true} 
          boardOrientation={color === 'w' ? 'white' : 'black'} 
          customBoardStyle={{ borderRadius: '5px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5 )'}} 
          customDarkSquareStyle={{backgroundColor: '#4b464f'}}
          customLightSquareStyle={{backgroundColor: '#d9d9d9'}}
          
          />
        </div>
        
      )}
      <div className='chat'>
      <Chat socket={socket}/>
      </div>
    </div>
  );
}

export default ChessGame;
