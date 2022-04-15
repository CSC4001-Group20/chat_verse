import { message, Input, Button } from 'antd'
import React from 'react'
import { API } from '../../App'
import { setCookie } from './cookie'
import './Login.css'

import 'antd/dist/antd.css';

var Login = () =>{

    var [loginEmail, setLoginEmail] = React.useState("")
    var [loginPassword, setLoginPassword] = React.useState("")

    const login = ()=>{
        setCookie("update",new Date().toUTCString())
        fetch(`${API}/auth/login/`,{
            method:'POST',
            body:JSON.stringify({
                loginEmail,
                loginPassword,
            })
        }).then(res=>{
            if(res.status===200){
                message.success("登录成功")
            }else if (res.status===403&&res.statusText==='U-INA'){
                message("成功登录，欢迎回来！")
                if(window.confirm("为保障扫码入群的均为我校师生,您需要完成邮箱验证")){

                }
                return res.json()
            }else if (res.status===403){
                message.error("已注册用户，密码输入错误")
            }else{
                message.warn("发生了未知错误，请稍后再重试！")
            }
        }).then(data=>{
            if(data&&data.uid){
                setTimeout(()=>{
                    window.location.reload()
                },500)
            }
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
                    <div className='Login-form-email'>
                        <div style={{textAlign:"left"}}>Email</div>
                        <Input style={{"height":"2rem"}} id='email' type="text" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)}/>
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