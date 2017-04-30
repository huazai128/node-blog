const db = require("../schema");

//验证用户数据格式
db.User.prototype.matchRegexp = {
    name:/^\w{4,30}$/,  //name验证
    password:/^.{5,26}$/, //密码验证
    email:/^\w+@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)+$/ //email验证
};

//Symbol():表示该字段指为独一无二的
//无效用户名
db.User.prototype.USERNAME_IS_NOT_VALIDATE = Symbol();
//用户名已经注册
db.User.prototype.USERNAME_IS_TO_BE_USED = Symbol();
//无效密码
db.User.prototype.PASSWORD_IS_NOT_VALIDATE = Symbol();
//两次密码不一致
db.User.prototype.TWO_PASSWORD_IS_NOT_MATCH = Symbol();
//无效email
db.User.prototype.EMAIL_IS_NOT_VALIDATE = Symbol();
//邮箱已经注册
db.User.prototype.EMAIL_IS_TO_BE_USED = Symbol();

//注册
db.User.prototype.register = function(){
    return new Promise((resolve,reject) => {
        //判断登录用户的数据是否合格
        if(!this.verifyUsername()){
            console.log("用户名格式不对");
            return reject(this.USERNAME_IS_NOT_VALIDATE);
        }
        if(!this.verifyPaasword()){
            console.log("密码格式不对");
            return reject(this.PASSWORD_IS_NOT_VALIDATE);
        }
        if(this.password !== this.confirmpwd){ //这个字段哪里来？
            console.log("密码不一致");
            return reject(this.TWO_PASSWORD_IS_NOT_MATCH);
        }
        if(!this.verifyEmail()){
            console.log("email格式不对")
            return reject(this.EMAIL_IS_NOT_VALIDATE);
        }
        resolve();
    }).then(() => {
        //判断用户名是否存在
        return this.getUserInfoByUsername(this.name).then((userInfo) => {
            if(userInfo){
                console.log("用户名已存在")
                return Promise.reject(this.USERNAME_IS_TO_BE_USED);//
            }else{
                return Promise.resolve()
            }
        })
    }).then(() => {
        //判断email是否存在
        return this.getUserInfoByEmail(this.email).then((userInfo) => {
            if(userInfo){
                console.log("email已存在")
                return Promise.reject(this.EMAIL_IS_TO_BE_USED)
            }else{
                return Promise.resolve()
            }
        })
    }).then(() => {
        //保存
        return this.save();
    })
}

//修改密码
db.User.prototype.resetPwd = function(){
    return new Promise((resolve,reject) => {
        if(!this.verifyPaasword()){
            return reject(this.PASSWORD_IS_NOT_VALIDATE);
        }
        if(this.password !== this.confirmpwd){
            return reject(this.TWO_PASSWORD_IS_NOT_MATCH);
        }
        resolve();
    }).then(() => {
        return this.save();
    })
}

//验证用户名格式
db.User.prototype.verifyUsername = function(){
    return this.matchRegexp.name.test(this.name);
}

//验证密码格式
db.User.prototype.verifyPaasword = function(){
    return this.matchRegexp.password.test(this.password);
}

//验证email格式
db.User.prototype.verifyEmail = function(){
    return this.matchRegexp.email.test(this.email);
}

//根据username获取用户信息
db.User.prototype.getUserInfoByUsername = function(name){
    return db.User.findOne({name:name}).exec();
}

//根据email获取用户信息
db.User.prototype.getUserInfoByEmail = function(email){
    return db.User.findOne({email:email}).exec();
}

//根据id查询用户
db.User.prototype.getUserById = function(id){
    return db.User.findOne({_id:id}).exec();
}

module.exports = db.User;

