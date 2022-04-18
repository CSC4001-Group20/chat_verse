import { Input, Button, message } from 'antd'

import React from 'react'
import { API } from '../../App'
import { setCookie } from '../Login/cookie'

import './Shop.css'

const Shop = () =>{
    const [ avatar_list, setAvatarList ] = React.useState([])
    
    //TODO
    const getAvatarList = ()=>{
        setCookie("update",new Date().toUTCString())
        fetch(`/user/avatar/`,{
            method:'GET',
        }).then(res=>{
            if(res.status===200){
                return res.json()
            }else{
                message.warn("get Avatar list Fail")
            }
        }).then(data=>{
            setAvatarList(data.result)
        })
    }

    //TODO
    const getMineList = ()=>{
        setCookie("update",new Date().toUTCString())
        fetch(`/user/avatar/`,{
            method:'GET',
        }).then(res=>{
            if(res.status===200){
                return res.json()
            }else{
                message.warn("get Avatar list Fail")
            }
        }).then(data=>{
            setAvatarList(data.result)
        }) 
    }

    //TODO
    const uploadAvatarList = ()=>{
        setCookie("update",new Date().toUTCString())
        fetch(`/user/avatar/`,{
            method:'POST',
            body:JSON.stringify({
                title: title,
                src: src,
            })
        }).then(res=>{
            if(res.status===200){
                return res.json()
            }else{
                message.warn("get Avatar list Fail")
            }
        }).then(data=>{
            setAvatarList(data.result)
        })
    }
    React.useEffect(()=>{
        getAvatarList()
    },[])


    return(
        <div className='Shop'>
                <button className='back' onClick={()=>
                    { window.history.back(-1)}}>Back
                </button>

                <h1>Avatar's Shop</h1>
            <div className='shop-window'>

                <div className='shop-choice-container'>
                    <button onClick={()=>{getAvatarList();console.log("----");}}>Avatar</button>

                    <button>Mine</button>
                </div>
                <div className='shop-items-container'>
                    {avatar_list.map(verse=>{
                            return(
                                <div className='ChatRooms-VerseList-Verse' >
                                    <div className='ChatRooms-VerseList-Verse-header'>
                                        Avatar's Name {verse.title}
                                    </div>
                                    <div className='ChatRooms-VerseList-Verse-content'>
                                        Click {verse.src} to Download
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