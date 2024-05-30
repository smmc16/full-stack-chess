import { useState, useEffect } from 'react';
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';


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
  let pgn;

  useEffect(() => {
    socket.emit('joinRoom', id);
    dispatch({type: 'FETCH_ROOM', payload: id});
  }, []);

  function setUpBoard () {
    console.log(pgn)
    game.loadPgn(pgn)
  };

  // Update variables once the room saga has loaded
  useEffect(() => {
    if(room.length === 1) {
    setPlayerColor();
    setPosition(room[0].position);

      if(room[0].position !== 'start') {
        setGame(new Chess(room[0].position))
        setTurn(position.split(' ')[1])
        pgn = room[0].pgn;
        setUpBoard();
      }
    } 
    
  }, [room]);

  // Set player color from the database
  function setPlayerColor() {
    if(user.id === room[0].black) {
      setColor('b');
    } else if (user.id === room[0].white) {
      setColor('w');
    } else {
      setDraggable(false);
    }
  };

  const makeMove = (move) => {
      game.move(move);
      setGame(new Chess(game.fen()));
      setTurn(game.turn());
      setPosition(game.fen())
      pgn = game.pgn();
    };

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
      setPosition(game.fen())
      if (movePiece === null) {return false}
      else { 
          socket.emit('makeMove', move, id);
      };
      console.log(position);
      console.log(pgn);
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

  // Watch for position change to update database
  useEffect(() => {
    putPosition();
  }, [position]);
  
  return (
    <div>
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
