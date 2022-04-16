import React from 'react'

import './ChatRooms.css'

const ChatRooms = () =>{
    return(
        <div className='ChatRooms'>
            <div className='ChatRooms-My'>
                ddd
            </div>
            <div style={{flexDirection:"column"}}>
                <div style={{
                        "fontSize":"calc(3vh + 25px)", color:"white", fontFamily:"Georgia",
                        marginTop:"8vh"
                    }}>
                        Select a Verse
                </div>
                <div className='ChatRooms-VerseList'>
                    {[1,1,1,1,1,1].map(verse=>{
                        return(
                            <div className='ChatRooms-VerseList-Verse'>
                                <div className='ChatRooms-VerseList-Verse-header'>
                                    Lianhao Gao's Personal Verse
                                </div>
                                <div className='ChatRooms-VerseList-Verse-content'>
                                    20 members, 6 online
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