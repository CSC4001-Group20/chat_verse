import { UserOutlined } from '@ant-design/icons'
import { RestOutlined } from '@ant-design/icons'
import { SendOutlined } from '@ant-design/icons'
import { AccountBookFilled, ImportOutlined } from '@ant-design/icons'
import { Input, Button, message, Upload } from 'antd'

import React from 'react'
import { setCookie } from '../Login/cookie'

import './Shop.css'

export function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]);
    else
        return null;
}

var Shop = () =>{
    
    const [ avatar_list, setAvatarList ] = React.useState([])
    const [ avatar, setAvatar ] = React.useState(null)
    const [ title, setTitle ] = React.useState("")
    const [ uid, setUid ] = React.useState(undefined)

    const [ src, setAvatarSrc ] = React.useState("")
    const [ cover, setAvatarCover ] = React.useState("")

    


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

    // //TODO
    const getUsingAvatar = ()=>{
        setCookie("update",new Date().toUTCString())
        fetch(`/user/avatar/?uid=${uid}`,{
            method:'GET',
        }).then(res=>{
            if(res.status===200){
                return res.json()
            }else{
                message.warn("get Avatar list Fail")
            }
        }).then(data=>{
            setAvatar(data.result)
        }) 
    }

    const uploadVRM = (file) => new Promise(resolve => {
        if(file){
            var timestamp = new Date().getTime();
            var img_id = "Avatar-VRM-"+timestamp
            var Bucket = 'ciwk-1301216399';
            var Region = 'ap-guangzhou';     /* store the location,must be in string */
            console.log(file)

            var COS = require('cos-js-sdk-v5');
            
            // init instance
            var cos = new COS({
                getAuthorization: function (options, callback) {
                    fetch('/user/get_cos_credential')
                    .then(res => res.json())
                    .then(data => {
                        var credentials = data && data.credentials;
                        if (!data || !credentials) return console.error('credentials invalid');
                        callback({
                            TmpSecretId: credentials.tmpSecretId,
                            TmpSecretKey: credentials.tmpSecretKey,
                            XCosSecurityToken: credentials.sessionToken,
                            StartTime: data.startTime,
                            ExpiredTime: data.expiredTime,
                        });
                    })
                }
            });
            if (cos){
                cos.putObject({
                    Bucket: Bucket, /* must */
                    Region: Region,     /* store the location, mudt be in string */
                    Key: img_id,//result.key,              /* must */
                    StorageClass: 'STANDARD',
                    Body: file, // upload the object
                    onProgress: function (progressData) {
                        console.log("Progress: ",JSON.stringify(progressData));
                        message.loading("Progress: "+progressData.percent)
                    }
                }, function(err, data) {
                    console.log(err || "http://"+data.Location);
                    if(data){
                        let url = "http://"+data.Location;
                        setAvatarSrc(url)
                    }else{
                        //when upload failed
                    }
                })
            }else{
                //when construct cos object failed
                console.log("Fail")
            }
        }else{
            resolve(false)
        }
    })

    const uploadCover = (file) => new Promise(resolve => {
        if(file){
            var timestamp = new Date().getTime();
            var img_id = "Avatar-VRM-"+timestamp
            var Bucket = 'ciwk-1301216399';
            var Region = 'ap-guangzhou';     /* store the location, mudt be in string */
            console.log(file)

            var COS = require('cos-js-sdk-v5');
            
            // init indtance
            var cos = new COS({
                getAuthorization: function (options, callback) {
                    fetch('/user/get_cos_credential')
                    .then(res => res.json())
                    .then(data => {
                        var credentials = data && data.credentials;
                        if (!data || !credentials) return console.error('credentials invalid');
                        callback({
                            TmpSecretId: credentials.tmpSecretId,
                            TmpSecretKey: credentials.tmpSecretKey,
                            XCosSecurityToken: credentials.sessionToken,
                            StartTime: data.startTime,
                            ExpiredTime: data.expiredTime,
                        });
                    })
                }
            });
            if (cos){
                cos.putObject({
                    Bucket: Bucket, /* must */
                    Region: Region,    /* store the location, mudt be in string */
                    Key: img_id,//result.key,              /* must */
                    StorageClass: 'STANDARD',
                    Body: file, // upload file obkect
                    onProgress: function (progressData) {
                        console.log("Progress: ",JSON.stringify(progressData));
                        message.loading("Progress: "+progressData.percent)
                    }
                }, function(err, data) {
                    console.log(err || "http://"+data.Location);
                    if(data){
                        let url = "http://"+data.Location;
                        setAvatarCover(url)
                    }else{
                        //when upload failed
                    }
                })
            }else{
                //when construct cos object failed
                console.log("Fail")
            }
        }else{
            resolve(false)
        }
    })

    const createAvatar = (file) => new Promise(resolve => {

        if(!cover || !src || !title){
            message.info("Fuck your mother!")
            return
        }
        let bodyData = {
            cover,
            src,
            title,
        }

        fetch("/user/avatar/",{
            method:"POST",
            body:JSON.stringify(bodyData)
        })
        .then(response=>{
            if (response.status===200) {
                getUsingAvatar()
                // return response.json()
            } else if (response.status!==200){
                message.error("Submit failed")
            }
        })
    })

    //TODO
    React.useEffect(()=>{
        console.log(getCookie('uid'))
        setUid(getCookie('uid'))
    },[])

    React.useEffect(()=>{
        if(uid){
            getAvatarList()
            getUsingAvatar()
        }
    },[uid])


    return(
        <div className='Shop'>
            <button className='back' onClick={()=>
                { window.history.back(-1)}}><ImportOutlined />
            </button>
            <div className='Shop-Up'>
                <div className='Shop-Upload'>
                    <div style={{
                            "fontSize":"calc(3vh + 25px)", color:"white", fontFamily:"Cohina",
                            marginTop:"8vh"
                        }}>
                            Upload Avatar
                    </div>
                    <div style={{flexDirection:"row", justifyContent:"center", width:"100%", marginTop:"20px"}}>
                        <Input style={{
                            width:"50%",
                            borderColor:"white",
                            borderRadius: "5px",
                            borderTopRightRadius:"0px",
                            borderBottomRightRadius:"0px",
                        }} value={title} onChange={e=>{setTitle(e.target.value)}}/>

                        <Button style={{
                            backgroundColor:"blueviolet",
                            borderColor:"blueviolet",
                            borderRadius: "5px",
                            borderTopLeftRadius:"0px",
                            borderBottomLeftRadius:"0px",
                        }} type="primary" onClick={()=>{createAvatar()}}>Create</Button>
                    </div>
                    <div style={{width:"100%", display:"flex", flexDirection:"row",justifyContent:"center", marginTop:"20px"}}>
                        <Upload
                            showUploadList={false}
                            action={uploadVRM}
                        >
                            <Button type="primary" icon={<AccountBookFilled/>} 
                                onClick={uploadVRM}style={{
                                    backgroundColor:"blueviolet",
                                    borderColor:"blueviolet",
                                    borderRadius: "5px",
                                }}
                            >
                                {src?'VRM File OK':'Upload VRM'}
                            </Button>
                        </Upload>

                        <Upload
                            showUploadList={false}
                            action={uploadCover}
                        >
                            <Button type="primary" icon={<AccountBookFilled/>} 
                                onClick={uploadCover}style={{
                                    backgroundColor:"blueviolet",
                                    borderColor:"blueviolet",
                                    borderRadius: "5px",
                                    marginLeft:"100px"
                                }}
                            >
                                {cover?'Cover Image OK':'Upload Image'}
                            </Button>
                        </Upload>
                    </div>
                </div>
                <div className='Shop-My'>
                    <div style={{
                            "fontSize":"calc(3vh + 25px)", color:"white", fontFamily:"Cohina",
                            marginTop:"8vh"
                        }}>
                        My Avatar
                    </div>
                    <div style={{width:"100%",display:"flex", flexDirection:"row",justifyContent:"center"}}>
                        {avatar&&
                            <div className='Avatar' style={{width:"100px", height:"100px", marginRight:"70px", marginTop:"20px"}}>
                                {/* {avatar.title} */}
                                <img style={{width:"100%", height:"100%", borderRadius:"5px"}} src={avatar.cover} alt={avatar.title}></img>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className='Shop-Down'>
                <div style={{
                        "fontSize":"calc(3vh + 25px)", color:"white", fontFamily:"Cohina",
                        marginTop:"8vh"
                    }}>
                    Select Avatar
                </div> 
                <div className='Shop-Avatar-List'>
                    {avatar_list.map(a=>{
                        return(
                            <div style={{marginLeft:"100px"}} onClick={()=>{
                                fetch(`/user/use_avatar/`,{
                                    method:'POST',
                                    body:JSON.stringify({
                                        uid: uid,
                                        avatar_id: a.id,
                                    })
                                })
                                .then(res=>{if(res.status===200){
                                    getAvatarList()
                                    getUsingAvatar()
                                }})
                            }}>
                                {/* <div style={{width:"100%", textAlign:"center"}}>
                                    {a.title}
                                </div> */}
                                <div className='Avatar'>
                                    <img style={{width:"100%", height:"100%", borderRadius:"5px"}} src={a.cover} alt={a.title}></img>
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