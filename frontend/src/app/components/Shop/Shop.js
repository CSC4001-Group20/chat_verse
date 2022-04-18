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
            var Region = 'ap-guangzhou';     /* 存储桶所在地域，必须字段 */
            console.log(file)

            var COS = require('cos-js-sdk-v5');
            
            // 初始化实例
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
                    Bucket: Bucket, /* 必须 */
                    Region: Region,     /* 存储桶所在地域，必须字段 */
                    Key: img_id,//result.key,              /* 必须 */
                    StorageClass: 'STANDARD',
                    Body: file, // 上传文件对象
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
                        //当上传失败时
                    }
                })
            }else{
                //当建立cos对象失败时
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
            var Region = 'ap-guangzhou';     /* 存储桶所在地域，必须字段 */
            console.log(file)

            var COS = require('cos-js-sdk-v5');
            
            // 初始化实例
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
                    Bucket: Bucket, /* 必须 */
                    Region: Region,     /* 存储桶所在地域，必须字段 */
                    Key: img_id,//result.key,              /* 必须 */
                    StorageClass: 'STANDARD',
                    Body: file, // 上传文件对象
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
                        //当上传失败时
                    }
                })
            }else{
                //当建立cos对象失败时
                console.log("Fail")
            }
        }else{
            resolve(false)
        }
    })

    const createAvatar = (file) => new Promise(resolve => {

        if(!cover || !src || !title){
            message.info("你他妈缺啊")
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
                return response.json()
            } else if (response.status!==200){
                message.error("提交失败？")
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

                        <Upload
                            showUploadList={false}
                            action={uploadVRM}
                        >
                            <Button type="primary" shape="circle" icon={<AccountBookFilled/>} 
                                onClick={uploadVRM}
                            >
                                {src?'VRM File OK':'Upload VRM'}
                            </Button>
                        </Upload>

                        <Upload
                            showUploadList={false}
                            action={uploadCover}
                        >
                            <Button type="primary" shape="circle" icon={<AccountBookFilled/>} 
                                onClick={uploadCover}
                            >
                                {cover?'Cover Image OK':'Upload Image'}
                            </Button>
                        </Upload>

                        <Button style={{
                            backgroundColor:"blueviolet",
                            borderColor:"blueviolet",
                            borderRadius: "5px",
                            borderTopLeftRadius:"0px",
                            borderBottomLeftRadius:"0px",
                        }} type="primary" onClick={()=>{createAvatar()}}>Create</Button>
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
                                {avatar.title}
                                <img src={avatar.cover} alt={avatar.title}></img>
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
                            <div className='Avatar'>
                                {a.title}
                            </div>
                        )
                    })}
                </div>
            </div>
                {/* <button className='back' onClick={()=>
                    { window.history.back(-1)}}><ImportOutlined />
                </button>
                <h1>Avatar Shop</h1>
                <Upload
                    showUploadList={false}
                    action={createAvatar}
                >
                    <Button type="primary" shape="circle" icon={<AccountBookFilled/>} 
                        onClick={()=>{createAvatar()}}
                    />
                </Upload>
            <div className='shop-window'>
                <div className='shop-choice-container'>
                    <Button type='primary' onClick={()=>{getAvatarList()}}>Avatar</Button>
                    <Button type='primary'>Mine</Button>
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
            <div>
                <div style={{flexDirection:"row", justifyContent:"center", width:"100%", marginTop:"20px"}}>
                        <Input style={{
                            width:"50%",
                            borderColor:"white",
                            borderRadius: "5px",
                            borderTopRightRadius:"0px",
                            borderBottomRightRadius:"0px",
                        }} value={title} onChange={e=>{setAvatarTitle(e.target.value)}}/>
                        
                        <Input style={{
                            width:"50%",
                            borderColor:"white",
                            borderRadius: "5px",
                            borderTopRightRadius:"0px",
                            borderBottomRightRadius:"0px",
                        }} value={src} onChange={e=>{setAvatarSrc(e.target.value)}}/>
                        
                        <Button style={{
                            backgroundColor:"blueviolet",
                            borderColor:"blueviolet",
                            borderRadius: "5px",
                            borderTopLeftRadius:"0px",
                            borderBottomLeftRadius:"0px",
                        }} type="primary" onClick={()=>{createAvatar()}}>Upload</Button>
                </div>
            </div> */}

        </div>
    )
}

export default Shop