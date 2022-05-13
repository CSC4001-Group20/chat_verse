import { message, Input, Button } from 'antd'
import React from 'react'
import { getCookie, setCookie } from './cookie'
import './Login.css'

import 'antd/dist/antd.css';

/* the login(sign in) module */
var Login = () =>{

    /* 
    the state variables 
    page will be refreshed when the variables are updated
    API:https://zh-hans.reactjs.org/docs/hooks-state.html
    */
    var [Username, setUsername] = React.useState("")
    var [loginPassword, setLoginPassword] = React.useState("")
    var [title, setTitle] = React.useState("")

    /* 
    front and back end interaction
    take the username and the password to compare with the data in our database
    if success, the system will automatically jump to the chatrooms page
    */
    const login = ()=>{
        setCookie("update",new Date().toUTCString())
        fetch(`/user/login/`,{
            method:'POST',
            body:JSON.stringify({ // input data
                username: Username,
                password: loginPassword,
            })
        }).then(res=>{
            if(res.status===200){ // success
                message.success("Successfully Login!")
                setTimeout(() => {
                    window.location.href="/chatrooms" // jump
                }, 1000);
            }else if (res.status===403){ // wrong password or username
                message.warn("Login Fail! Check Your Account, Password and Try Again!")
            }else{
                message.warn("Unknown Error! Try Again!")
            }
        }).then(data=>{

        })
    }

   

    /* the frontend UI */
    return(
        <div className='Login'>
            {/* header */}
            <div className='Login-header'>
                <div style={{"fontSize":"calc(5vh + 30px)", fontFamily:"Cochin"}}>Chat Verse</div>
                <div style={{"fontSize":"calc(1vh + 15px)", fontFamily:"Cochin"}}>The Best Way for Everyone To Experience Metaverse
                <br></br> Click Right Side to Begin
                </div>
            </div>
            {/* login form, containing the input data for login */}
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
                        <Button id='submit' type='button' onClick={()=>{login();}}>Sign in</Button>
                    </div>
                </form>
                {/* have no account and can sign up a new account */}
                <div className='Login-Sign-in'>
                     <a href="/sign" style={{color:"blueviolet", fontFamily:"Cochin"}}><u>Sign up in ChatVerse</u></a>
                </div>
            </div>
        </div>
    )
}

export default Login