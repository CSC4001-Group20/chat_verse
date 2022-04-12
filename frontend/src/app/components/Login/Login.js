import React from 'react'
import './Login.css'

var Login = () =>{

    var [loginEmail, setLoginEmail] = React.useState("")
    var [loginPassword, setLoginPassword] = React.useState("")

    return(
        <div className='Login'>
            <div className='Login-header'>
                <div style={{"fontSize":"calc(4vh + 25px)"}}>ChatVerse</div><br/>
                <div style={{"fontSize":"calc(1vh + 15px)"}}>easy access to metaverse chat for everyone</div>
            </div>
            <div className='Login-form'>
                <form>
                    <div style={{fontSize:"calc(1vh + 20px)", fontFamily:"Georgia", textAlign:"center"}}>Welcome Back!</div>
                    <div className='Login-form-email'>
                        <div style={{textAlign:"left"}}>Email</div>
                        <input id='email' type="text" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)}/>
                    </div>
                    <div className='Login-form-password'>
                        <div style={{textAlign:"left"}}>Password</div>
                        <input id='password' type="text" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)}/>
                    </div>
                    <div className='Login-form-submit'>
                        <button id='submit'>Login</button>
                    </div>
                </form>
                <div className='Login-Sign-in'>
                    Or <a href="/sign"><u>Sign up in ChatVerse</u></a>
                </div>
            </div>
        </div>
    )
}

export default Login