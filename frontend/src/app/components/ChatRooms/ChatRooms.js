import { message, Input, Button } from 'antd'
import { getCookie, setCookie } from '../Login/cookie'
import React from 'react'

import './ChatRooms.css'
import { PoweroffOutlined } from '@ant-design/icons'
import { SendOutlined } from '@ant-design/icons'
import { UserOutlined } from '@ant-design/icons'
import { RestOutlined } from '@ant-design/icons'
import { KeyOutlined } from '@ant-design/icons'
import { Modal } from 'antd'

/* the chatrooms module, to manage or to join chatrooms */
const ChatRooms = () =>{
    /* 
    the state variables 
    page will be refreshed when the variables are updated
    API:https://zh-hans.reactjs.org/docs/hooks-state.html
    */
    const [ createRoomName, setCreateRoomName ] = React.useState("")
    const [ verse_list, setVerseList ] = React.useState([])
    const [ P_verse_list, setP_VerseList ] = React.useState([])
    const [ status, setChangeStatus ] = React.useState(false)
    const [ changePassword, setChangePassword ] = React.useState()
    const [ oldPassword, setOldPassword ] = React.useState()

    /* 
    front and back end interaction
    this function can help user change their password
    user will input their old password as well as the new password
    */
    const change = () =>{
        fetch(`/user/change_pwd/`,{
            method:'POST',
            body: JSON.stringify({
                old_password: oldPassword,
                new_password: changePassword,
            })
        }).then(res=>{
            if(res.status===200){
                message.success("Changd!")
            }else{
                message.warn("Cannot Change")
            }
        })
    }
    /* 
    front and back end interaction
    create a room with a desired name (the name cannot be the same with any existing room)
    */
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
                if(res.status===200){ // success
                    message.success("Succfssfully Create Room")
                    return res.json()
                }else if (res.status===403){ // invalid account
                    message.warn("Create Room Fail")
                }else if (res.status===405){
                    message.warn("Chat Room Already Exist")
                }else{
                    message.warn("Create Room Fail")
                }
            }).then(data=>{
                if (data){ // reload window
                    window.location.reload()
                }
                
            })
        }
    }
    /* 
    front and back end interaction
    join an existing room
    each user will send his token containing the information about his account to the system
    this token can distinguish the user from other users inside the room
    */
    const joinRoom = (room_name)=>{
        setCookie("update",new Date().toUTCString())
        fetch(`/chat/joinRoom/`,{
            method:'POST',
            body:JSON.stringify({
                room_name:room_name
            })
        }).then(res=>{
            if(res.status===200){ // success
                message.success("Succfssfully Join Room")
                window.location.href="/chatroom/?room_name="+room_name+'&uid='+getCookie('uid') // use cookie as the token
            }else{
                message.warn("Join Room Fail")
            }
        }).then(data=>{
            if(data){
            }
        })
    }
    /* 
    front and back end interaction
    a user can delete his chatrooms
    */
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

    /* 
    front and back end interaction
    fetch all the chatrooms available in the backend database
    the result will be rendered in the frontend UI
    */
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

    /* 
    front and back end interaction
    fetch all the chatrooms available in the backend database
    however this time the system will only return the belonging chatrooms for the user
    */
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

    /**
    React useeffect hook
    the functions (the former arugments) will be executed whenever the variables (the latter arguments) are changed
    reference API: https://zh-hans.reactjs.org/docs/hooks-effect.html
    **/
    React.useEffect(()=>{
        get_verse_list()
        get_personal_verse_list()
    },[])

    /* the frontend UI */
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
            <button className="changePassword" 
                onClick={()=>{setChangeStatus(true)}}>
                <KeyOutlined />
            </button>

            <Modal 
                visible={status}
                onOk={()=>{change()}}
                onCancel={()=>{setChangeStatus(false)}}
                okText={"Change Password"}
            >
                <div className='Sign-form-username'>
                    <div style={{textAlign:"left", fontFamily:"Cochin"}}>Reset Password</div>
                    <Input style={{"height":"2rem"}} id='username' type="text" value={oldPassword} onChange={e=>setOldPassword(e.target.value)}/>
                    <Input style={{"height":"2rem"}} id='username' type="text" value={changePassword} onChange={e=>setChangePassword(e.target.value)}/>
                </div>
            </Modal>
        </div>
    )
}

export default ChatRooms