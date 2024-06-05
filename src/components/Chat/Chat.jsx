import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Chat.css';

export default function Chat ({socket}) {

    const dispatch = useDispatch();

    const {id} = useParams();

    let room = useSelector(store => store.room);
    let user = useSelector(store => store.user);

    let [message, setMessage] = useState('');
    let [messages, setMessages] = useState([]);
    let [index, setIndex] = useState(0);

    useEffect(() => {
        socket.emit('joinRoom', room.id);
        dispatch({type: 'FETCH_ROOM', payload: id})
      }, []); 

    socket.once('sendMessage', (msg, user) => {
        console.log('message received');
        setIndex(index + 1);
        setMessages([...messages, {id: index, author: user, text: msg}])
      });


    function handleSubmit (e) {
        e.preventDefault();
        if(message) {
          setIndex(index + 1);
          socket.emit('sendMessage', message, room.id, user.username);
          setMessages([...messages, {id: index, author: user.username, text: message}])
          setMessage('');
          ;
        }  
      }


    return(
        <>
        <div id="chat">
      <form onSubmit={handleSubmit}>
        <input type="text" value={message} placeholder='Chat!' onChange={(e) => setMessage(e.target.value)}/>
        <input type="submit" />
      </form>
        <div className='chatbox'>
          {messages.map((msg) => 
            <p key={msg.id} className='message'><b>{msg.author}</b>: {msg.text}</p>
        ).reverse()}
        </div>
     </div>
        </>
    )
}