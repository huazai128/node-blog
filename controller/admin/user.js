const express = require("express");
const router = express.Router();
const db = require("../../module");

//个人中心 
router.get("/setprofile",(req,res,next) => {
    let id = req.session.user._id
    db.User.findById({_id:id}).exec((err,user) => {
        if(err){
            console.log(err);
            return res.redirect("/")
        }
        res.render("setprofile",{
            title:"个人中心",
            user:user
        })
    })
})

//修改个人头像
router.get("/setavator",(req,res) => {
    let id = req.session.user._id;
    db.User.findById({_id:id}).exec((err,user) => {
        if(err){
            console.log(err);
            return res.redirect("/")
        }
        res.render("setavator",{
            title:"修改头像",
            user:user
        });
    })
    
})

//修改密码
router.get("/resetpwd",(req,res) => {
    let id = req.session.user._id;
    db.User.findById({_id:id}).exec((err,user) => {
        if(err){
            console.log(err);
            return res.redirect("/")
        }
        res.render("password",{
            title:"修改密码",
            user:user,
            message:false
        });
    })
    
})


module.exports = router