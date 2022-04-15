import { Input, Button, message } from 'antd'
import React from 'react'
import { API } from '../../App'
import { setCookie } from '../Login/cookie'

import './Sign.css'

var Sign = () =>{
    
    var [SignEmail, setSignEmail] = React.useState()
    var [SignPassword, setSignPassword] = React.useState()
    var [SignPasswordConfir, setSignPasswordConfir] = React.useState()

    const sign = () =>{
        if(SignPassword===SignPasswordConfir){
            let bodydata = {
                email: SignEmail,
                SignPassword,
            }
            setCookie("update",new Date().toUTCString())
            fetch(`${API}/auth/register/`,{
                method:'POST',
                body: JSON.stringify(bodydata),
            })
            .then(response=>{
                if (response.status===200) {
                    message.success("成功注册，正在生成验证邮件")
                }else if (response.status===429) {

                }else if (response.status===403){
                    message.info("邮箱已被注册！")
                }
                else{
                    message.warn("发生了未知错误，请稍后再重试！")
                }
            })
        }
        else{
            message("Inconsistent Password!")
        }
    }

    return(
        <div className='Sign'>
            <div style={{display:"flex", flexDirection:"column"}}>
                <div style={{
                    "fontSize":"calc(4vh + 25px)", color:"white", fontFamily:"Georgia",
                    marginTop:"10vh"
                }}>Sign up</div>
                <div>
                    <form className='Sign-form'>
                        <div className='Sign-form-email'>
                            <div style={{textAlign:"left"}}>Email</div>
                            <Input style={{"height":"2rem"}} id='email' type="text" value={SignEmail} onChange={e=>setSignEmail(e.target.value)}/>
                        </div>
                        <div className='Sign-form-password'>
                            <div style={{textAlign:"left"}}>Password</div>
                            <Input style={{"height":"2rem"}} id='password' type="password" value={SignPassword} onChange={e=>setSignPassword(e.target.value)}/>
                        </div>
                        <div className='Sign-form-passwordConfir'>
                            <div style={{textAlign:"left"}}>Confirm Password</div>
                            <Input style={{"height":"2rem"}} id='passwordConfir' type="password" value={SignPasswordConfir} onChange={e=>setSignPasswordConfir(e.target.value)}/>
                        </div>
                        <div className='Sign-form-submit'>
                            <Button style={{cursor:"pointer"}} id='submit' type="button" onClick={sign}>Sign up</Button>
                        </div>
                        <div className='Sign-Sign-in'>
                            Or <a href="/login" style={{color:"blueviolet"}}><u>Sign in ChatVerse</u></a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Sign