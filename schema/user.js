const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const bcrypt = require("bcrypt");
let SALT_WORK_FACTORY = 10;

const UserSchema = new Schema({ //user字段
    name:{type:String,unique:true},
    email:{type:String,unique:true},
    password:{type:String,default:""},
    articles:[{type:ObjectId,ref:"Article"}],
    pv:{type:Number,default:0},
    head:{type:String,default:""},
    poster:{type:String,default:""},
    signature:{type:String,default:""},
    avator:{type:String,default:""},
    role:{type:Number,default:0},
    meta:{
        createTime:{type:Date,default:Date.now},
        updateTime:{type:Date,default:Date.now}
    }
})
//保存
UserSchema.pre("save",function(next){
    console.log("进来了save");
    let user = this;
    //判断数据是否最新
    if(this.isNew){  
        this.meta.createTime = this.meta.updateTime = Date.now();
    }else{
        this.meta.updateTime = Date.now();
    }
    //密码加密
    bcrypt.genSalt(SALT_WORK_FACTORY, function (err, salt) {
		if (err) return next(err)
		//hash接受三个参数,第三个参数拿到生成后的hash
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err)
			user.password = hash;
			next()
		})
	})
});
UserSchema.methods = {
    //登录密码验证
	comparePassword: function (_password, cb) {
		bcrypt.compare(_password,this.password,function(err,isMatch) {
			if (err) return cb(err);
			cb(null,isMatch);
		})
	}
}
module.exports = exports.User = mongoose.model("User",UserSchema);