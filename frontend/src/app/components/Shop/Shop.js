import { Input, Button, message } from 'antd'
import React from 'react'
import { API } from '../../App'
import { setCookie } from '../Login/cookie'

import './Shop.css'

var Shop = () =>{
    




    return(
        <div className='Shop'>
                <button className='back' onClick={()=>{window.location.href="/chatrooms"}}>Back</button>


                <h1>Avatar's Shop</h1>
            <div className='shop-window'>

                <div className='shop-choice-container'>
                    <button>Avatar</button>

                    <button>Mine</button>
                </div>
                <div className='shop-items-container'>
                    {[1,1,1,1,1,1].map(verse=>{
                            return(
                                <div className='ChatRooms-VerseList-Verse' >
                                    <div className='ChatRooms-VerseList-Verse-header'>
                                        {/* {verse.title} */}
                                        Avatar
                                    </div>
                                    <div className='ChatRooms-VerseList-Verse-content'>
                                        hihi
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>


        </div>
    )
}

export default Shop