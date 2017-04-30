const express = require("express");
const router = express.Router();
//GET登录
router.get("/login",(req,res,next) => {
    res.render("login",{
        title:"登录页面",
        message:false,
        user:req.session.user
    })
})
//GET注册
router.get("/reg",(req,res,next) => {
    res.render("register",{
        title:"注册",
        message:false
    })
})

module.exports = router;