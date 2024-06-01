import React, { useState, useEffect } from 'react';
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ChessGame.css';

function ChessGame({socket}) {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user); 
  const room = useSelector(store => store.room);
  let [position, setPosition] = useState('start');
  let [game, setGame] = useState(new Chess());
  let [turn, setTurn] = useState(game.turn());
  let [color, setColor] = useState('w')
  let [draggable, setDraggable] = useState(true);
  const { id } = useParams();
  let [pgn, setPgn] = useState();

  useEffect(() => {
    socket.emit('joinRoom', id);
    dispatch({type: 'FETCH_ROOM', payload: id});
  }, [id]);

  // Loads PGN once the pgn variable has been updated
  function setUpBoard () {
    console.log(pgn)
    game.loadPgn(pgn)
  };

  useEffect(() => {
    if(pgn) {
      setUpBoard()
    }
  }, [pgn])

  // Update variables once the room saga has loaded
  useEffect(() => {
    if(room.length === 1) {
    setPlayerColor();
    setPgn(room[0].pgn)
      if(room[0].position !== 'start') {
        setGame(new Chess(room[0].position));
        setPosition(room[0].position)
        setTurn(game.turn())
        console.log(game)
      }
    } 
    
  }, [room]);

  // Sets player color from the database
  function setPlayerColor() {
    if(user.id === room[0].black) {
      setColor('b');
    } else if (user.id === room[0].white) {
      setColor('w');
    } else {
      setDraggable(false);
    }
  };

  // Updates game on player move
  const makeMove = (move) => {
      game.move(move);
      setGame(new Chess(game.fen()));
      setTurn(game.turn());
      setPgn(game.pgn());
      
    };

  // for onPieceDrop prop in chessboard, emits to makeMove socket
  function onDrop(sourceSquare, targetSquare) {
      const movePiece = makeMove({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });
      const move = {
          from: sourceSquare,
          to: targetSquare,
          promotion: "q", 
      };
      setPosition(game.fen());
      putPosition()
      if (movePiece === null) {return false}
      else { 
          socket.emit('makeMove', move, id);
          return true;
      };
    }

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

  socket.on('makeMove', (move) => {
    onDrop(move.from, move.to);
    setPosition(game.fen());
  });

  let gameObject = {
    position,
    pgn,
  }

  // Update database with new position and pgn
  function putPosition() {
    axios.put(`/api/game/position/${id}`, gameObject).then((response) => {

    }).catch(error => {
      console.log('Error in PUT /position', error);
    })
  };
  
  return (
    <div id="page">
      {room.length === 1 ? <h2>{room[0].room_id}</h2> : <h2></h2>}
      <Chessboard id="board"
        boardWidth={500}
        position={position} 
        onPieceDrop={onDrop}
        arePiecesDraggable={draggable}
        autoPromoteToQueen={true} 
        boardOrientation={color === 'w' ? 'white' : 'black'} 
        customBoardStyle={{ borderRadius: '5px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5 )'}} 
        customDarkSquareStyle={{backgroundColor: '#4b464f'}}
        customLightSquareStyle={{backgroundColor: '#d9d9d9'}}
        
        />
    </div>
  );
}

export default ChessGame;
