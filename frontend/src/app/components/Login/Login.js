import { message, Input, Button } from 'antd'
import React from 'react'
import { setCookie } from './cookie'
import './Login.css'

import 'antd/dist/antd.css';

var Login = () =>{

    var [Username, setUsername] = React.useState("")
    var [loginPassword, setLoginPassword] = React.useState("")
    var [title, setTitle] = React.useState("")

    const login = ()=>{
        setCookie("update",new Date().toUTCString())
        fetch(`/user/login/`,{
            method:'POST',
            body:JSON.stringify({
                username: Username,
                password: loginPassword,
            })
        }).then(res=>{
            if(res.status===200){
                message.success("Successfully Login!")
                setTimeout(() => {
                    window.location.href="/chatrooms"
                }, 1000);
            }else if (res.status===403){
                message.warn("Login Fail! Check Your Account, Password and Try Again!")
            }else{
                message.warn("Unknown Error! Try Again!")
            }
        }).then(data=>{

        })
    }

    const select_a_verse_enter = ()=>{
        setCookie("update",new Date().toUTCString())
            fetch(`/chat/verse_list/`,{
                method:'GET',
            }).then(res=>{
                if(res.status===200){
                    message.success("Succfssfully Join Room")
                    setTimeout(() => {
                        window.location.href="/chatroom/?roomNmae="+title
                    }, 1000);
                }else{
                    message.warn("Join Room Fail")
                }
            }).then(data=>{})
    }

    const manage_my_verse_enter = (title)=>{
        setCookie("update",new Date().toUTCString())
            fetch(`/chat/startRoom/`,{
                method:'POST',
                body:JSON.stringify({
                    title:title
                })
            }).then(res=>{
                if(res.status===200){
                    message.success("Succfssfully Start Room")
                    setTimeout(() => {
                        window.location.href="/chatroom/?roomNmae="+title
                    }, 1000);
                }else{
                    message.warn("Start Room Fail")
                }
            }).then(data=>{})
    }

    return(
        <div className='Login'>
            <div className='Login-header'>
                <div style={{"fontSize":"calc(5vh + 30px)", fontFamily:"Cochin"}}>Chat Verse</div>
                <div style={{"fontSize":"calc(1vh + 15px)", fontFamily:"Cochin"}}>The Best Way for Everyone To Experience Metaverse
                <br></br> Click Right Side to Begin
                </div>
            </div>
            <div className='Login-form'>
                <form>
                    <div style={{fontSize:"calc(1vh + 25px)", fontFamily:"Cochin", textAlign:"center"}}>Welcome Back!</div>
                    <div className='Login-form-username'>
                        <div style={{textAlign:"left", fontFamily:"Cochin"}}>Username</div>
                        <Input style={{"height":"2rem"}} id='username' type="text" value={Username} onChange={e=>setUsername(e.target.value)}/>
                    </div>
                    <div className='Login-form-password'>
                        <div style={{textAlign:"left", fontFamily:"Cochin"}}>Password</div>
                        <Input style={{"height":"2rem"}} id='password' type="password" visibilityToggle value={loginPassword} onChange={e=>setLoginPassword(e.target.value)}/>
                    </div>
                    <div className='Login-form-submit' style={{fontFamily:"Cochin"}}>
                        <Button id='submit' type='button' onClick={()=>{login();select_a_verse_enter();}}>Sign in</Button>
                    </div>
                </form>
                <div className='Login-Sign-in'>
                     <a href="/sign" style={{color:"blueviolet", fontFamily:"Cochin"}}><u>Sign up in ChatVerse</u></a>
                </div>
            </div>
        </div>
    )
}

export default Login