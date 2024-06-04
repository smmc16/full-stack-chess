import React, { useState, useEffect } from 'react';
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
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
  const history = useHistory();
  let [pgn, setPgn] = useState();
  let [didLoad, setDidLoad] = useState(false);
  let [didLoad1, setDidLoad1] = useState(false);

  useEffect(() => {
    socket.emit('joinRoom', id);
    dispatch({type: 'FETCH_ROOM', payload: id});
  }, [id]);

  // Loads PGN once the pgn variable has been updated
  // function setUpBoard () {
  //   console.log('set pgn');
  //   game.loadPgn(pgn);
  // };

  // useEffect(() => {
  //   if(!didLoad1) {
  //   if(pgn) {
  //     setUpBoard();
  //     setDidLoad1(true);
  //   };
  // };
  // }, [pgn])

  // Update variables once the room saga has loaded
  useEffect(() => {
    if(!didLoad) {
    if(room.length === 1) {
    setPlayerColor();
    setPgn(room[0].pgn)
    setDidLoad(true)
      if(room[0].position !== 'start') {
        console.log('set game')
        setGame(new Chess(room[0].position));
        setPosition(room[0].position);
      }
    } 
  }
  }, [room]);

  useEffect(() => {
    setTurn(game.turn())
  }, [game])

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

  // for onPieceDrop prop in chessboard, emits to makeMove socket
  function onDrop(sourceSquare, targetSquare) {
    console.log(game.fen());
    console.log(`from: ${sourceSquare} to:${targetSquare}`)
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", 
    };
    try {
      const movePiece = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });
          console.log(movePiece);
          setGame(new Chess(game.fen()))
          setPosition(game.fen());
          setPgn(game.pgn());
          console.log(game.fen());
          putPosition();
          socket.emit('makeMove', move, id);
          return console.log('valid move');
      } catch (error) { 
        return console.log('invalid move', error)}
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
    onDrop(m.from, m.to);
    console.log('move made in socket');
  });

  // Update database with new position and pgn
  function putPosition() {
    axios.put(`/api/game/position/${id}`, { position: game.fen(), pgn: game.pgn() }).then((response) => {

    }).catch(error => {
      console.log('Error in PUT /position', error);
    })
  };

  function handleClick() {
    socket.emit('leaveRoom', id);
    history.push('/menu')
  }
  
  return (
    <div id="page">
      <button onClick={handleClick}>Go to Menu</button>
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
