const express = require("express"),
    router = express.Router(),
    db = require("../../module");
    marked = require("marked");  //解析器和编译器
    _ = require("underscore");  //
//POST注册
router.post("/reg",(req,res,next) => {
    let user = new db.User();
    let data = req.body.user;
    user.name = data.name;
    user.email = data.email;
    user.password = data.password;
    user.confirmpwd = data.confirmpwd;
    user.head = "http://7xsn9b.com1.z0.glb.clouddn.com/" + Math.ceil(7 * Math.random()) + ".jpg";
    user.register().then(function(user){
        console.log("登录成功");
        user = user.toObject();
        delete user.password;
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
    db.User.findOne({name:_name},(err,user) => {
        if(err){
            console.log(err);
            return res.redirect("/user/login"); //重定向到登录
        }
        if(!user){
            return res.render("login",{
                title:"登录",
                message:"用户不存在"
            })
        }
        user.comparePassword(_password,(err,info) => {
            if(err){
                console.log(err);
                return res.redirect("/user/login");
            }
            user.comparePassword(_password, (err, isMatch) => {
                if (err) {
                    console.log(err);
                    return res.redirect('/user/login');
                }
                console.log(isMatch);
                if (isMatch) {
                    req.session.user = user;
                    return res.redirect('/');
                } else {
                    res.render('login', {
                        title: '登录',
                        message: '密码错误'
                    })
                }
            })
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


module.exports = router;
