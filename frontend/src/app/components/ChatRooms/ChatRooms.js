import { Button } from 'antd'
import React from 'react'

import './ChatRooms.css'

const ChatRooms = () =>{
    return(
        <div className='ChatRooms'>
            <div className='ChatRooms-My'>
                <div className='ChatRooms-My-Add'>
                    <div style={{
                            "fontSize":"calc(3vh + 25px)", color:"white", fontFamily:"Georgia",
                            marginTop:"8vh"
                        }}>
                            Create a Verse
                    </div>
                </div>
                <div style={{
                        "fontSize":"calc(3vh + 25px)", color:"white", fontFamily:"Georgia",
                        marginTop:"8vh"
                    }}>
                        Manage my Verse
                </div>
                <div className='ChatRooms-My-VerseList'>
                    {[1,1,1,1,1,1].map(verse=>{
                        return(
                            <div className='ChatRooms-My-VerseList-Verse'>
                                <div  style={{"flexDirection":"column"}}>
                                    <div className='ChatRooms-My-VerseList-Verse-header'>
                                        Lianhao Gao's Personal Verse
                                    </div>
                                    <div className='ChatRooms-My-VerseList-Verse-content'>
                                        20 members active
                                    </div>
                                </div>
                                <div style={{"flexDirection":"column"}}>
                                    <Button type="link">
                                        Start Verse
                                    </Button>
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
        </div>
    )
}

export default ChatRooms