import { message, Input, Button } from 'antd'
import { setCookie } from '../Login/cookie'
import React from 'react'

import './ChatRooms.css'
import { PoweroffOutlined } from '@ant-design/icons'
import { SendOutlined } from '@ant-design/icons'
import { UserOutlined } from '@ant-design/icons'
import { RestOutlined } from '@ant-design/icons'

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
                message.warn("get verse list Fail")
            }
        }).then(data=>{
            console.log(data.result)
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
                message.warn("get personal verse list Fail")
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
                    <div style={{flexDirection:"row", justifyContent:"center", width:"100%", marginTop:"20px"}}>
                        <Input style={{
                            width:"50%",
                            borderColor:"white",
                            borderRadius: "5px",
                            borderTopRightRadius:"0px",
                            borderBottomRightRadius:"0px",
                        }} value={createRoomName} onChange={e=>{setCreateRoomName(e.target.value)}}/>

                        <Button style={{
                            backgroundColor:"blueviolet",
                            borderColor:"blueviolet",
                            borderRadius: "5px",
                            borderTopLeftRadius:"0px",
                            borderBottomLeftRadius:"0px",
                        }} type="primary" onClick={()=>{createRoom()}}>Create</Button>
                    </div>
                </div>
                <div style={{
                        "fontSize":"calc(3vh + 25px)", color:"white", fontFamily:"Cohina",
                        marginTop:"4vh"
                    }}>
                        My Verse
                </div>


                <div className='ChatRooms-VerseList'>
                    {P_verse_list.map(verse=>{
                        return(
                            <div className='ChatRooms-VerseList-Verse' id="spe" onClick={()=>{}} style={{
                                display:"flex",
                                flexDirection:"row",
                                justifyContent:"stretch",
                            }}>
                                <div className='ChatRooms-VerseList-Verse-header' style={{minWidth:"80%"}}>
                                    <div><SendOutlined style={{}}/>&nbsp;&nbsp;&nbsp;{verse.title}</div>
                                </div>
                                <div className='ChatRooms-VerseList-Verse-content-2'>
                                    <div onClick={()=>{deleteRoom(verse.room_name);}}><RestOutlined />Delete</div>
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
                            <div className='ChatRooms-VerseList-Verse'  onClick={()=>{joinRoom(verse.room_name);}} style={{
                                display:"flex",
                                flexDirection:"row",
                                justifyContent:"stretch",
                            }}>
                                <div className='ChatRooms-VerseList-Verse-header'>
                                    <div><SendOutlined style={{}}/>&nbsp;&nbsp;&nbsp;{verse.title}</div>
                                </div>
                                <div className='ChatRooms-VerseList-Verse-content'>
                                    <div><UserOutlined />&nbsp;{verse.n_member}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>



            </div>

            <button className="quit" 
                onClick={()=>{window.location.href="/login"}}>
                <PoweroffOutlined />
            </button>


            
        </div>
    )
}

export default ChatRooms