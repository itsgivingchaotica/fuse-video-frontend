import React, {useState, useEffect} from 'react';
import '../styles/callpage.css';
import {useSelector, useDispatch} from 'react-redux';
import {postLivestreamThunk} from "../redux/livestreams/livestream.actions";
import ChatComponent from '../components/ChatComponent';

import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");


function CallPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const loggedInUser = useSelector((state) => state.user);

  useEffect(() => {
    console.log(loggedInUser);
  }, [])

  const joinRoom = () => {
    if (username !=="" && room !==""){
      socket.emit("join_room", room);
      setShowChat(true);

  }
  }

  return (
    <div className="callPage">
      {!showChat? (
        <div className="joinChatContainer">
          <h3>Join chat</h3>
          <input type="text" placeholder="name" onChange={(e) => {setUsername(e.target.value)}}/>
          <input type="text" placeholder="room ID" onChange={(e) => setRoom(e.target.value)}/>
          <button onClick={joinRoom}>Join room</button>
        </div>
      ): (<div>
        <ChatComponent socket={socket} username={username} room={room}/>
        </div>
        )
          
      }

    </div>
  );
}

export default CallPage;