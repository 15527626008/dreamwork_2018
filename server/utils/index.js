let crypto = require('crypto');

const encrypt = (content,keyValue)=>{
    let MD5 = crypto.createHash('md5');
   return new Buffer(MD5.update(content+keyValue).digest('hex'),'utf-8').toString('base64');
    
}

module.exports = {encrypt};