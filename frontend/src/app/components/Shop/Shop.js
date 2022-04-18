import { ImportOutlined } from '@ant-design/icons'
import { Input, Button, message } from 'antd'

import React from 'react'
import { setCookie } from '../Login/cookie'

import './Shop.css'

export function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr==document.cookie.match(reg))
 
        return unescape(arr[2]);
    else
        return null;
}

var Shop = () =>{
    
    const createAvatar = (file) => new Promise(resolve => {
        if(file){
            var timestamp = new Date().getTime();
            var img_id = "post-img-"+timestamp
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
                }, function(err, data) {
                    console.log(err || "http://"+data.Location);
                    if(data){
                        let url = "http://"+data.Location;
                        //resolve("http://"+data.Location);
                        let bodyData={
                            title:'New Avatar', //TODO
                            url:url,
                        }
                        console.log(url)
                        fetch("/user/avatar/",{
                            method:"POST",
                            body:JSON.stringify(bodyData)
                        })
                        .then(response=>{
                            if (response.status===200) {
                                return response.json()
                            } else if (response.status===500){
                                message.error("您处于未登录状态？")
                            } else if (response.status===404){
                                message.error("您修改的用户已经不存在了！")
                            } else if (response.status===502){
                                message.error("服务器被马虎的技术仔关闭了！是不是正在进行后台升级呢？")
                            } else {
                                message.error("对不起，似乎发生了未知的错误，快联系技术仔来修复吧！")
                            }
                        })
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

    const [ avatar_list, setAvatarList ] = React.useState([])
    
    const [ title, setAvatarTitle ] = React.useState("")
    const [ src, setAvatarSrc ] = React.useState("")


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

    //TODO
    const getMineList = ()=>{
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

    //TODO
    const uploadAvatarList = ()=>{
        setCookie("update",new Date().toUTCString())
        fetch(`/user/avatar/`,{
            method:'POST',
            body:JSON.stringify({
                // title: title,
                // src: src,
            })
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
    React.useEffect(()=>{
        getAvatarList()
    },[])


    return(
        <div className='Shop'>
                <button className='back' onClick={()=>
                    { window.history.back(-1)}}><ImportOutlined />
                </button>
                <h1>Avatar Shop</h1>
            <div className='shop-window'>
                <div className='shop-choice-container'>
                    <Button type='primary' onClick={()=>{getAvatarList();console.log("----");}}>Avatar</Button>
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
            </div>

        </div>
    )
}

export default Shop