import React, {useState} from 'react';
import '../styles/chatComponent.css';
import {useDispatch} from 'react-redux';
import {setCurrentRoom} from "../redux/room/room.actions";
import Box from '@mui/material/Box'
import FloatingMenu from '../components/navbar/FloatingMenu';
import { useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JoinPage = ({socket}) => {
    const [code, setCode] = useState("");
    const [choseType, setChoseType] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isSmallScreen = useMediaQuery("(max-width: 900px");
  
    //called to join livestream upon clicking join livestream button
    const joinRoom = async () => {
      if (code !==""){
        // socket.emit("join_room", livestreamCode); //join socket room based on inputted livestream code

        try{
            if(choseType === "Livestream"){
              //fetch the livestream to join from db based on inputed livestream code
              const response = await axios.get(`http://localhost:3001/api/livestreams/byCode/${code}`);
              const responseData = response.data; //if livestream code does not exist repsonse will be null

              //set currently joined livestream in redux
              dispatch(setCurrentRoom(responseData));

              //navigate to specific livestream or videochat page
              navigate(`/livestream/${code}`);
            }
            else{ //else user chose to join a video chat
              const response = await axios.get(`http://localhost:3001/api/videochats/byCode/${code}`);
              const responseData = response.data;
              dispatch(setCurrentRoom(responseData));
              navigate(`/videochat/${code}`);
            }

        }
        catch(error){
            console.log(error);
        }
      }
    }
  
    return (
      <div className="callPage" style={{marginTop: "4rem"}}>
        {!choseType
        ? (<div className="minipage">
            <h1 className="minipage-header">Select Room To Join</h1>
            <div className="choice-button-container">
              <button className="choice-button" onClick={() => setChoseType("Livestream")}>Livestream</button>
              <button className="choice-button" onClick={() => setChoseType("Video Chat")}>Video Chat</button>
            </div>
          </div>)
        : <div className="joinChatContainer">
            <h3>Join {choseType}</h3>
            <input type="text" placeholder="livestream code.." onChange={(e) => {setCode(e.target.value)}}/>
            <button onClick={joinRoom}>Join {choseType}</button>
          </div>}

      <Box sx={{pt:10}} >
        {isSmallScreen 
        ? <div style={{position: 'fixed', left: '50%', bottom: '20px', transform: 'translate(-50%, -50%)',  margin: '0 auto'}}>
            <FloatingMenu />
          </div> 
        : <></>}
      </Box>
  
      </div>
    );
}

export default JoinPage