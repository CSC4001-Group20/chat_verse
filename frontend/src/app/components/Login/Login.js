import { message, Input, Button } from 'antd'
import React from 'react'
import { API } from '../../App'
import { setCookie } from './cookie'
import './Login.css'

import 'antd/dist/antd.css';

var Login = () =>{

    var [Username, setUsername] = React.useState("")
    var [loginPassword, setLoginPassword] = React.useState("")

    const login = ()=>{
        setCookie("update",new Date().toUTCString())
        fetch(`http://127.0.0.1:8000/user/login/?`,{
            method:'POST',
            body:JSON.stringify({
                username: Username,
                password: loginPassword,
            })
        }).then(res=>{
            if(res.status===200){
                message.success("登录成功")
            }else{
                message.warn("发生了未知错误，请稍后再重试！")
            }
        }).then(data=>{

        })
    }


    return(
        <div className='Login'>
            <div className='Login-header'>
                <div style={{"fontSize":"calc(4vh + 25px)"}}>ChatVerse</div>
                <div style={{"fontSize":"calc(1vh + 15px)"}}>easy access to metaverse chat for everyone</div>
            </div>
            <div className='Login-form'>
                <form>
                    <div style={{fontSize:"calc(1vh + 25px)", fontFamily:"Georgia", textAlign:"center"}}>Welcome Back!</div>
                    <div className='Login-form-username'>
                        <div style={{textAlign:"left"}}>Username</div>
                        <Input style={{"height":"2rem"}} id='username' type="text" value={Username} onChange={e=>setUsername(e.target.value)}/>
                    </div>
                    <div className='Login-form-password'>
                        <div style={{textAlign:"left"}}>Password</div>
                        <Input style={{"height":"2rem"}} id='password' type="password" visibilityToggle value={loginPassword} onChange={e=>setLoginPassword(e.target.value)}/>
                    </div>
                    <div className='Login-form-submit'>
                        <Button id='submit' type='button' onClick={()=>{login()}}>Sign in</Button>
                    </div>
                </form>
                <div className='Login-Sign-in'>
                    Or <a href="/sign" style={{color:"blueviolet"}}><u>Sign up in ChatVerse</u></a>
                </div>
            </div>
        </div>
    )
}

export default Login