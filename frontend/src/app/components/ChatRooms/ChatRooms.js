import { message, Input, Button } from 'antd'
import { setCookie } from '../Login/cookie'
import React from 'react'

import './ChatRooms.css'

const ChatRooms = () =>{
    const [ createRoomName, setCreateRoomName ] = React.useState("")
    const [ verse_list, setVerseList ] = React.useState([])
    const [ P_verse_list, setP_VerseList ] = React.useState([])


    const createRoom = ()=>{
        if (createRoomName===""){
            message.warn("Room Name Cannot Be Empty!")
        }else{
            setCookie("update",new Date().toUTCString())
            fetch(`/chat/createRoom/`,{
                method:'POST',
                body:JSON.stringify({
                    title:createRoomName
                })
            }).then(res=>{
                if(res.status===200){
                    message.success("Succfssfully Create Room")
                    return res.json()
                    // setTimeout(() => {
                    //     console.log(res)
                    //     window.location.href="/chatroom/?room_name="+res.json()['room_name']
                    // }, 1000);
                }else if (res.status===403){
                    message.warn("Create Room Fail")
                }else if (res.status===405){
                    message.warn("Chat Room Already Exist")
                }else{
                    message.warn("Create Room Fail")
                }
            }).then(data=>{
                if (data){
                    // window.location.href="/chatroom/?room_name="+data.room_name
                    window.location.reload()
                }
                
            })
        }
    }

    const joinRoom = (room_name)=>{
        setCookie("update",new Date().toUTCString())
        fetch(`/chat/joinRoom/`,{
            method:'POST',
            body:JSON.stringify({
                room_name:room_name
            })
        }).then(res=>{
            if(res.status===200){
                message.success("Succfssfully Join Room")
                window.location.href="/chatroom/?room_name="+room_name
            }else{
                message.warn("Join Room Fail")
            }
        }).then(data=>{
            if(data){
            }
        })
    }

    const deleteRoom = (room_name)=>{
        setCookie("update",new Date().toUTCString())
        fetch(`/chat/deleteRoom/`,{
            method:'POST',
            body:JSON.stringify({
                room_name:room_name
            })
        }).then(res=>{
            if(res.status===200){
                message.success("Succfssfully delete Room")
                window.location.reload()
            }else{
                message.warn("delete Room Fail")
            }
        }).then(data=>{

        })
    }

    const get_verse_list = ()=>{
        fetch(`/chat/verse_list/`,{
            method:'GET',
        }).then(res=>{
            if(res.status===200){
                return res.json()
            }else{
                message.warn("Join Room Fail")
            }
        }).then(data=>{
            setVerseList(data.result)
        })
    }

    const get_personal_verse_list = (uid)=>{
        fetch(`/chat/verse_list/?filter_uid=true`,{
            method:'GET',
        }).then(res=>{
            if(res.status===200){
                return res.json()
            }else{
                message.warn("Join Room Fail")
            }
        }).then(data=>{
            setP_VerseList(data.result)
        })
    }

    React.useEffect(()=>{
        get_verse_list()
        get_personal_verse_list()
    },[])


    return(
        <div className='ChatRooms'>
            <div className='ChatRooms-My'>
                <div className='ChatRooms-My-Add'>
                    <div style={{
                            "fontSize":"calc(3vh + 25px)", color:"white", fontFamily:"Cohina",
                            marginTop:"8vh"
                        }}>
                            Create a Verse
                    </div>
                    <div >
                        <input placeholder="Room Name" id='createRoom-input' style={{fontFamily:"Cochin", height:'6vh', width:'24vw',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px'}} value={createRoomName} onChange={e=>{
                        setCreateRoomName(e.target.value)}}>
                        </input>
                    </div>

                    <div className='createRoom-submit' style={{fontFamily:"Cochin"}}>
                        <button style={{fontFamily:"Cochin", width:'8vw', height:'6vh',                       
                        backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '10px'}}  
                        onClick={()=>{createRoom();console.log(createRoomName);}}>Create</button>
                    </div>


                </div>
                <div style={{
                        "fontSize":"calc(3vh + 25px)", color:"white", fontFamily:"Cohina",
                        marginTop:"4vh"
                    }}>
                        Verse Created By Me
                </div>


                <div className='ChatRooms-My-VerseList'>
                    {P_verse_list.map(verse=>{
                        return(
                            <div className='ChatRooms-My-VerseList-Verse'>
                                <div  style={{"flexDirection":"column", fontFamily:"Cohina"}}>
                                    <div className='ChatRooms-My-VerseList-Verse-header'>
                                        {verse.title}'s Chat Room
                                    </div>
                                    {/* <div className='ChatRooms-My-VerseList-Verse-content'>
                                        {verse.membersCount} members active
                                    </div> */}
                                </div>
                                <div style={{"flexDirection":"column" , fontFamily:"Cohina"}}>
                                    {/* <Button type="link" onClick={()=>{startRoom(verse.room_name);}}>Start Verse</Button> */}
                                    <Button type="link" onClick={()=>{deleteRoom(verse.room_name);}}>Delete Verse</Button>
                                </div>
                            </div>
                        )
                    })}
                </div>




            </div>
            <div style={{flexDirection:"column"}}>
                <div style={{
                        "fontSize":"calc(3vh + 25px)", color:"white", fontFamily:"Cochin" ,
                        marginTop:"8vh"
                    }}>
                        The Verse World
                </div>



                <div className='ChatRooms-VerseList' style={{fontFamily:"Cochin"}}>
                    {verse_list.map(verse=>{
                        return(
                            <div className='ChatRooms-VerseList-Verse'  onClick={()=>{joinRoom(verse.room_name);}}>
                                <div className='ChatRooms-VerseList-Verse-header'>
                                    {verse.title}
                                </div>
                                <div className='ChatRooms-VerseList-Verse-content'>
                                    {verse.n_member} users visited.
                                </div>
                            </div>
                        )
                    })}
                </div>



            </div>
            <div className='quit'>
                <a href="/login" >QUIT</a>
            </div>

        </div>
    )
}

export default ChatRooms