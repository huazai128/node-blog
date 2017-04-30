var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

exports.open = function(){
    const url = "mongodb://localhost/blog";
    const opts = {
        server:{
            socketOptions:{
                keepAlive:1
            }
        }
    }
    mongoose.connect(url,opts,function(err){
        if(err){
            console.log(err.message);
        }else{
            console.log("数据库连接成功");
        }
    })
}

exports.close = function(){
    mongoose.disconnect(function(){
        console.log("关闭数据库连接");
    })
}