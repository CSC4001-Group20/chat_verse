import React, { useEffect } from "react";
import "./ChatBar.css"

var idx_max = 0

var chat_socket = null;

var timeout

const ChatBar = () => {

    const [ text, setText ] = React.useState("")



    React.useEffect(()=>{
        initSocket()
    },[])

    const [ messages, setMessages ] = React.useState([])

    const initSocket = () => {
        // 从 URL Params 获取 roon name
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const roomName = urlParams.get('roomname');
        const wss_protocol = (window.location.protocol == 'https:') ? 'wss://': 'ws://';
        chat_socket = new WebSocket(
            wss_protocol + window.location.host + '/ws/chat/'  + roomName + '/'
        );

        console.log(wss_protocol + window.location.host + '/ws/chat/'  + roomName + '/')
        // 建立webchat_socket连接时触发此方法
        chat_socket.onopen = function(e) {
            // Do nothing
        }

        // 从后台接收到数据时触发此方法
        chat_socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.log(messages)
            
            
            setMessages(messages => {
                let msgs = messages.map(m=>m)
                msgs.push({...data, idx:idx_max})
                if(msgs.length>5){
                    msgs = msgs.slice(1)
                }
                return msgs
            })
            idx_max += 1
            
            if(timeout) clearTimeout(timeout)
            timeout = setTimeout(()=>{
                setMessages([])
                clearTimeout(timeout)
            },5000,idx_max) // 5秒后全部消息消失
            
        };
        
    }

    // const removeMsg = (idx) => {
    //     let msgs = []
    //     messages.forEach(m=>{if(idx===m.idx)msgs.push(m)})
    //     setMessages(msgs)
    // }


    return (
        <div className="ChatBar">
            <div className="ChatBar-messages">
                {messages.map(m=>(
                    <div key={Math.random()} className="ChatBar-message">
                        {m.idx}: {m.message}
                    </div>
                ))}
            </div>

            <div className="ChatBar-actions">
                <input placeholder="Massage" style={{fontFamily:"Cochin", borderRadius: '10px'}} value={text} onChange={e=>{
                    setText(e.target.value)
                }}>
                </input>


                <button className="SendButton" style={{fontFamily:"Cochin",borderRadius: '10px'}} onClick={()=>{
                    console.log("Send")
                    if (!chat_socket) { console.log("error"); return }
                    chat_socket.send(JSON.stringify({
                        'message': text
                    }));
                }}>Send</button>
            </div>
        </div>
    )
}

export default ChatBar