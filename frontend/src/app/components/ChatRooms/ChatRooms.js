import { Input, Button } from 'antd'
import React from 'react'

import './ChatRooms.css'

const ChatRooms = () =>{
    const [ createRoomName, setCreateRoomName ] = React.useState("")
    const [ existRoomName, setExistRoomName] = React.useState("")

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
                        backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '10px'}} onClick={()=>{
                        console.log(createRoomName) // 这里获取了输入的roomname，接下来就是新建name
                        }}>Create</button>
                    </div>


                </div>
                <div style={{
                        "fontSize":"calc(3vh + 25px)", color:"white", fontFamily:"Cohina",
                        marginTop:"4vh"
                    }}>
                        Manage my Verse
                </div>
                <div className='ChatRooms-My-VerseList'>
                    {[1,1,1,1,1,1].map(verse=>{
                        return(
                            <div className='ChatRooms-My-VerseList-Verse'>
                                <div  style={{"flexDirection":"column", fontFamily:"Cohina"}}>
                                    <div className='ChatRooms-My-VerseList-Verse-header'>
                                        Lianhao Gao's Chat Room
                                    </div>
                                    <div className='ChatRooms-My-VerseList-Verse-content'>
                                        20 members active
                                    </div>
                                </div>
                                <div style={{"flexDirection":"column" , fontFamily:"Cohina"}}>
                                    <Button type="link" onClick={()=>{
                                    console.log(existRoomName) //这里获取了当前的roomname
                                    }}>Start Verse</Button>
                                    <Button type="link">
                                        Delete Verse
                                    </Button>
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
                        Select a Verse
                </div>
                <div className='ChatRooms-VerseList' style={{fontFamily:"Cochin"}}>
                    {[1,1,1,1,1,1].map(verse=>{
                        return(
                            <div className='ChatRooms-VerseList-Verse'>
                                <div className='ChatRooms-VerseList-Verse-header'>
                                    Lianhao Gao's Personal Verse
                                </div>
                                <div className='ChatRooms-VerseList-Verse-content'>
                                    20 members active
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='quit'><a href="/login" >QUIT</a></div>

        </div>
    )
}

export default ChatRooms