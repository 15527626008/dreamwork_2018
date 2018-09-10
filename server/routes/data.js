
const fs          = require('fs');
const axios = require('axios');
require('url-search-params-polyfill');
const {AppKey,EBusinessID,ReqURL,DataType} = require('../config/Contents');
const { encrypt } = require('../utils');
/**
 * 通过Promise读取存储的数据,确保有数据后再执行其他操作
 * @return{null} [无]
 */
let readFileData = ()=>{
    let promise = new Promise((resolve,reject)=>{
        fs.readFile('./server/public/database/database.json','utf-8',(err,data)=>{
            if(err){
                console.log(err);
                reject('read file err!');
            }else{
                data        = JSON.parse(data);
                dataBase    = data;

                resolve(data);
            }
        });
    });

    return promise;
    
}
/**
 * 发送post请求
 * @param url  请求链接
 * @param data 请求数据
 * @param config 配置文件
 */
let doPost = (url,data,config={},callback)=>{
    let err = '';
    axios.post(url, data,{
        timeout:5000,
        ...config,
    })
      .then(function (response) {
        callback(err,response)
      })
      .catch(function (error) {
          err = error;
          callback(err,'');
        console.log(error);
      });
}
/**
 * 发送get请求
 * @param url  请求链接
 */
let doGet = (url,config={},callback)=>{
    let err = '';
    axios.get(url,{
        timeout:5000,
        ...config
    })
      .then(function (response) {
        callback(err,response)
      })
      .catch(function (error) {
        let err = error;
        callback(err,'');
        console.log(error);
      });  
}
/**
 * 获取用户列表
 * 
 */
exports.listUsers = (req,res)=>{
    let reg         = /\?callback=(.*)/;
    let params      = reg.exec(req.url)[1].split('&');
    let callback    = params[0];
    let requestData = params[1];

    let reqDataStr  = unescape(requestData);
    let dataSign    = encrypt(reqDataStr,AppKey);

    let {ShipperCode} = JSON.parse(reqDataStr);

    /**
     * 如果用户选择了快递公司则根据请求1002查询用户的快递信息，否则先通过2002接口根据用户的
     * 快递单号查询可能的快递公司，在查询快递信息
     */
    let RequestType         = '';
    ShipperCode?RequestType = '1002':RequestType = '2002'

    let obj = new URLSearchParams();
    
    obj.append('EBusinessID',EBusinessID);
    obj.append('RequestType',RequestType);
    obj.append('RequestData',requestData);
    obj.append('DataSign',escape(dataSign));
    obj.append('DataType',DataType['json']);
    
    doPost(ReqURL,obj,{headers:{"Content-Type":"application/x-www-form-urlencoded"}},(err,data)=>{
        const sendData = {
            status: 0,
            msg: "",
            data: "",
        }
        if(err){
            sendData.msg = "数据查询失败,错误代码："+err.code||'500';
            let json = JSON.stringify(sendData);
            res.send(callback + '(' + json + ')');
        }else{
            sendData.status = 1;
            sendData.msg = "success";
            sendData.data = data.data;
            let json = JSON.stringify(sendData);
            res.send(callback + '(' + json + ')');
        }
    });
}
