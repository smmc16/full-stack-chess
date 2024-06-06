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
  const history = useHistory();
  const user = useSelector(store => store.user); 
  const room = useSelector(store => store.room);
  let [game, setGame] = useState();
  let [turn, setTurn] = useState();
  let [color, setColor] = useState('w')
  let [draggable, setDraggable] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    socket.emit('joinRoom', id);
    dispatch({type: 'FETCH_ROOM', payload: id});
    
  }, [id]);

  // Update variables once the room saga has loaded
  useEffect(() => {
    console.log('HERE', room)
    if(room.id && room.id === Number(id)) {
      setPlayerColor();
      if(room.position !== 'start') {
        setGame(new Chess(room.position));
        console.log('set game', room.position);
      } else if (room.position === 'start') {
        setGame(new Chess());
      }
    
  }
  }, [room]);

  // When game changes, set the turn and check if the game is over
  useEffect(() => {
    if(game) {
      setTurn(game.turn());
    }
    if (game && game.isGameOver()){
        setTimeout(() => {
          deleteGame();
          history.push('/menu')
        }, 60.0 * 1000)
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

  // Deletes game from db once it's over
  function deleteGame() {
    axios.delete(`/api/game/gameover/${id}`).then((response) => {
      console.log('game deleted')
    }).catch(error => {
      console.log('Error in DELETE /gameover', error);
    })
  };
  
  return (
    <div id="page">
      {room.room_id ? <h2 id="roomID">{room.room_id}</h2> : <h2></h2>}
      {game && game.isGameOver() && game.turn() === "w" ? <h2 className='gameOver'>Game Over <br /> Black is the winner!</h2> : <h2></h2>}
      {game && game.isGameOver() && game.turn() === "b" ? <h2 className='gameOver'>Game Over <br /> White is the winner!</h2> : <h2></h2>}
      {game && game.isDraw() ? <h2 className='gameOver'>It's a draw!</h2> : <h2></h2>}
      <div id='turnColor'>
      {game && game.turn() === 'w' ? <h2>Turn: White</h2> : <h2>Turn: Black</h2>}
      {room && color === 'w' ? <h4>You are playing as white</h4> : <h4>You are playing as black</h4>}
      </div>
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
