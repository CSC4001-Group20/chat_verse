import { Input, Button, message } from 'antd'
import React from 'react'
import { API } from '../../App'
import { setCookie } from '../Login/cookie'

import './Sign.css'

var Sign = () =>{
    
    var [Username, setUsername] = React.useState()
    var [SignPassword, setSignPassword] = React.useState()
    var [SignPasswordConfir, setSignPasswordConfir] = React.useState()
    var [Email, setEmail] = React.useState()
    var [code, setCode] = React.useState()
    const [ sent, setSent ] = React.useState()

    const sign = () =>{
        if(SignPassword===SignPasswordConfir && Email && code){
            let bodydata = {
                username: Username,
                password: SignPassword,
                code: code,
                email: Email,
            }
            setCookie("update",new Date().toUTCString())
            fetch(`/user/sign/`,{
                method:'POST',
                body: JSON.stringify(bodydata),
            })
            .then(response=>{
                if (response.status===200) {
                    message.success("Sussessfully Sign! Return Login pagr to Login")
                    setTimeout(() => {
                        window.location.href="/login"
                    }, 1000);
                }else if (response.status===403){
                    message.warn("User Already Exist, Please Change Your Username")
                }else{
                    message.warn("User already exists") 
                }
            })
        }
        else{
            message.warn("Inconsistent Password!")
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }
    }

    const send_email_code = (email) => {
        if(!email) return
        fetch(`/user/send_email/`,{
            method:'POST',
            body:JSON.stringify({'email':email})
        }).then((res)=>{
            if(res.status===200){
                message.success("Email Sent Successfully!")
                setSent(true)
            }else{
                message.warn("Cannot Send Email")
            }
        })
    }

    return(
        <div className='Sign'>
            <div style={{display:"flex", flexDirection:"column"}}>
                <div style={{
                    "fontSize":"calc(4vh + 25px)", color:"white", fontFamily:"Cochin",
                    marginTop:"10vh"
                }}>Sign up</div>
                <div>
                    <form className='Sign-form'>
                        <div className='Sign-form-username'>
                            <div style={{textAlign:"left", fontFamily:"Cochin"}}>Username</div>
                            <Input style={{"height":"2rem"}} id='username' type="text" value={Username} onChange={e=>setUsername(e.target.value)}/>
                        </div>
                        <div className='Sign-form-emial'>
                            <div style={{textAlign:"left", fontFamily:"Cochin"}}>Email Address</div>
                            <Input style={{"height":"2rem"}} id='username' type="text" value={Email} onChange={e=>setEmail(e.target.value)}/>
                        </div>
                        <div className='Sign-form-code'>
                            <Input style={{"height":"2rem", marginTop:0, marginRight:10}} id='username' type="text" value={code} onChange={e=>setCode(e.target.value)}/>
                            <Button style={{cursor:"pointer", fontFamily:"Cochin", marginBottom:0}} id='submit' type="button" onClick={()=>{send_email_code(Email)}}>{sent?"Resend":"Send Code"}</Button>
                        </div>

                        <div className='Sign-form-password'>
                            <div style={{textAlign:"left", fontFamily:"Cochin"}}>Password</div>
                            <Input style={{"height":"2rem"}} id='password' type="password" value={SignPassword} onChange={e=>setSignPassword(e.target.value)}/>
                        </div>
                        <div className='Sign-form-passwordConfir'>
                            <div style={{textAlign:"left", fontFamily:"Cochin"}}>Confirm Password</div>
                            <Input style={{"height":"2rem"}} id='passwordConfir' type="password" value={SignPasswordConfir} onChange={e=>setSignPasswordConfir(e.target.value)}/>
                        </div>
                        <div className='Sign-form-submit'>
                            <Button style={{cursor:"pointer", fontFamily:"Cochin"}} id='submit' type="button" onClick={()=>{sign()}}>Sign up</Button>
                        </div>
                        <div className='Sign-Sign-in'>
                            <a href="/login" style={{color:"blueviolet", fontFamily:"Cochin"}}><u>Sign in ChatVerse</u></a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Sign