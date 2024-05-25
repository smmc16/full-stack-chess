import { useState, useEffect } from 'react';
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useSelector, useDispatch } from 'react-redux';
import './ChessGame.css'

function ChessGame() {
  const [position, setPosition] = useState('start');
  const [game, setGame] = useState(new Chess());
  const [turn, setTurn] = useState(game.turn());
  
  const makeMove = (move) => {
      game.move(move);
      setGame(new Chess(game.fen()));
      setTurn(game.turn());
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
          socket.emit('makeMove', move, roomID);
      };

    }
  
  return (
    <div>
      
    </div>
  );
}

export default TemplateFunction;
