import React from 'react'

import './Sign.css'

var Sign = () =>{
    
    var [SignEmail, setSignEmail] = React.useState()
    var [SignPassword, setSignPassword] = React.useState()
    var [SignPasswordConfir, setSignPasswordConfir] = React.useState()

    var Validate = () =>{
        if(SignPassword!==SignPasswordConfir){
            alert("Inconsistent Password!")
            setSignPasswordConfir("")
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
                            <input id='email' type="text" value={SignEmail} onChange={e=>setSignEmail(e.target.value)}/>
                        </div>
                        <div className='Sign-form-password'>
                            <div style={{textAlign:"left"}}>Password</div>
                            <input id='password' type="text" value={SignPassword} onChange={e=>setSignPassword(e.target.value)}/>
                        </div>
                        <div className='Sign-form-passwordConfir'>
                            <div style={{textAlign:"left"}}>Confirm Password</div>
                            <input id='passwordConfir' type="text" value={SignPasswordConfir} onChange={e=>setSignPasswordConfir(e.target.value)}/>
                        </div>
                        <div className='Sign-form-submit'>
                            <button style={{cursor:"pointer"}} id='submit' type="button" onClick={Validate}>Sign up</button>
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