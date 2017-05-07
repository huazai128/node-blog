const express = require("express"),
    router = express.Router(),
    db = require("../../module");
    marked = require("marked");  //解析器和编译器
    _ = require("underscore");  //js工具类

//POST注册
router.post("/reg",(req,res,next) => {
    let user = new db.User();
    let data = req.body.user;
    user.name = data.name;
    user.email = data.email;
    user.password = data.password;
    user.confirmpwd = data.confirmpwd;
    user.head = "http://7xsn9b.com1.z0.glb.clouddn.com/" + Math.ceil(7 * Math.random()) + ".jpg";
    //注册
    user.register().then(function(user){
        console.log("登录成功");
        req.session.user = user;
        res.redirect("/");// 重定向
    }).catch(function(err){
        let errorMessage = "";
        switch (err){
            case user.USERNAME_IS_NOT_VALIDATE:
                errorMessage = "用户名格式不对";
                break;
            case user.PASSWORD_IS_NOT_VALIDATE:
                errorMessage = "密码格式不对";
                break;
            case user.TWO_PASSWORD_IS_NOT_MATCH:
                errorMessage = "输入密码不一致";
                break;
            case user.EMAIL_IS_NOT_VALIDATE:
                errorMessage = "email格式不对";
                break;
            case user.EMAIL_IS_TO_BE_USED:
                errorMessage = "email已被注册";
                break;
            case user.USERNAME_IS_TO_BE_USED:
                errorMessage = "用户名已被注册";
                break;
            default:
                errorMessage = "发生了一点意外";
                break;
        }
        res.render("register",{  //
            title:"注册",
            message:errorMessage
        })
    })
});

//POST登录
router.post("/login",(req,res,next) => {
    let data = req.body.user,
        _name = data.name,
        _password = data.password;
    console.log(_password);
    db.User.findOne({name:_name},(err,user) => {
        if(err){
            console.log(err);
            return res.redirect("/user/login"); //重定向到登录
        }
        if(!user){
            return res.render("login",{
                title:"登录",
                message:"密码或用户错误"
            })
        }
        user.comparePassword(_password,(err,info) => {
            if(err){
                console.log(err);
                return res.redirect("/user/login");
            }
            if(info){
                req.session.user = user;
                user = user.toObject();
                delete user.password;
                return res.redirect("/");
            }else{
                res.render("login",{
                    title:"登录",
                    message:"密码或用户错误"
                })
            }
        })
    })
});

//退出登录
router.get("/logout",(req,res,next) => {
    req.session.destroy(function(){
        console.log("退出");
        res.redirect("/")
    })
})


//验证用户名是否注册
router.get("/username",(req,res,next) => {
    let username = req.query.username;
    let user = new db.User();
    user.name = username;
    if(!user.verifyUsername){ //用户格式
        res.json({
            errorCode:1,
            message:"用户名格式不对"
        })
    }
    user.getUserInfoByUsername(username).then((user) => {
        if(user){
            res.json({
                errorCode:2,
                message:"用户名已存在"
            })
        }else{
            res.json({
                errorCode:0,
                message:"验证成功"
            })
        }
    }).catch((err) => {
        res.json({
            errorCode:3,
            message:err
        })
    })
})

//验证email是否注册
router.get("/email",(req,res,next) => {
    let email = req.query.email;
    let user = new db.User();
    user.email = email
    if(!user.verifyEmail){ //email格式不对
        res.json({
            errorCode:1,
            message:"邮箱格式不对"
        })
    }
    user.getUserInfoByEmail(email).then((user) => {
        if(user){
            res.json({
                errorCode: 2,
                message:"邮箱已注册"
            })
        }else{
            res.json({
                errorCode:0,  // 0 为false
                message:"验证成功"
            })
        }
    }).catch((err) => {
        res.json({
            errorCode:3,
            message:err
        })
    })
})

module.exports = router;
