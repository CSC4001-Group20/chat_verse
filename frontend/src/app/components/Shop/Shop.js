import { Input, Button, message, notification, Upload } from 'antd'
import { AccountBookFilled } from '@ant-design/icons';

import React from 'react'
import { API } from '../../App'
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



    return(
        <div className='Shop'>
            <button className='back' onClick={()=>{ window.history.back(-1)}}>Back</button>


            <h1>Avatar's Shop</h1>



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
                    <button>Avatar</button>

                    <button>Mine</button>
                </div>
                <div className='shop-items-container'>
                    {[1,1,1,1,1,1].map(verse=>{
                            return(
                                <div className='ChatRooms-VerseList-Verse' >
                                    <div className='ChatRooms-VerseList-Verse-header'>
                                        {/* {verse.title} */}
                                        Avatar
                                    </div>
                                    <div className='ChatRooms-VerseList-Verse-content'>
                                        hihi
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