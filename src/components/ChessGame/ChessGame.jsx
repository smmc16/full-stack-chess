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
  
  useEffect(() => {
    socket.emit('joinRoom', id);
    dispatch({type: 'FETCH_ROOM', payload: id});
  }, [])

  useEffect(() => {
    if(room.length === 1) {
    setPlayerColor();
    setPosition(room[0].position)
    }
  }, [room])

  function setPlayerColor() {
    if(user.id === room[0].white) {
      setColor('w');
    } else if (user.id === room[0].black) {
      setColor('b');
    } else {
      setDraggable(false);
    }
  }

  const makeMove = (move) => {
      game.move(move);
      setGame(new Chess(game.fen()));
      setTurn(game.turn());
    }
  let positionObject = {
      position
    }
  function putPosition() {
    console.log(position)
    axios.put(`/api/game/position/${id}`, positionObject).then((response) => {

    }).catch(error => {
      console.log('Error in PUT /position', error);
    })
  }

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
      if (movePiece === null) {return false}
      else { 
          socket.emit('makeMove', move, id);
      };

    }

  function areDraggable () {
    console.log(color, turn)
    if(color == turn) {
        setDraggable(true)
    } else {
        setDraggable(false)
    }
  }

  useEffect(() => {
      areDraggable();
      console.log(position)
      putPosition()
  }, [turn])

  socket.on('makeMove', (move) => {
    onDrop(move.from, move.to);
    setPosition(game.fen());
})
  
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
