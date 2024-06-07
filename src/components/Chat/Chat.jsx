import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material';
import axios from 'axios';
import './Chat.css';

export default function Chat ({socket}) {

    const dispatch = useDispatch();

    const {id} = useParams();

    const user = useSelector(store => store.user);
    const chat = useSelector(store => store.chat);

    let [message, setMessage] = useState('');
    let [messages, setMessages] = useState([]);
    let [index, setIndex] = useState(0);

    useEffect(() => {
        dispatch({type: 'FETCH_ROOM', payload: id});
        dispatch({type: 'FETCH_CHAT', payload: id});
        socket.emit('joinRoom', id);
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
          socket.emit('sendMessage', message, id, user.username);
          setMessages([...messages, {id: index, author: user.username, text: message}])
          setMessage('');
          ;
        }  
      }

    // To change the color of the join room button
    const { palette } = createTheme();
    const { augmentColor } = palette;
    const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

    const theme = createTheme({
        palette: {
            main: createColor('#00acb0'),
        },
    });

        const buttonStyle = {
        color: 'white',
        height: '55px',
        }

    return(
        <>
        <div id="chat">
      <form onSubmit={handleSubmit}>
        <ThemeProvider theme={theme}>
        <TextField type="text" value={message} label='Chat!' className='customOutline' InputLabelProps={{style: { color: '#00acb0' },}} onChange={(e) => setMessage(e.target.value)}/>
        <Button type="submit" variant='contained' color='main' style={buttonStyle}>Send</Button>
        </ThemeProvider>
      </form>
        <div className='chatbox'>
            {messages.length === 0 ? <p>*crickets*</p> : <p></p> }
            {messages.map((msg) => 
                <p key={msg.id} className='message'><b>{msg.author}</b>: {msg.text}</p>
            ).reverse()}
        </div>
     </div>
        </>
    )
}