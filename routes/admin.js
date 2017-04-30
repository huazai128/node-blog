const express = require("express");
const path = require('path');
const adminApp = express();

adminApp.locals.moment = require("moment");//日期格式化处理；传入到前端处理，如果前后分离则哉后台处理返回

let admin = (app) => {
    adminApp.set("views",path.join(__dirname,"../views/admin"));
    adminApp.set("view engine","ejs");

    adminApp.locals.env = process.env.NODE_ENV || "dev";
    adminApp.locals.reload = true;
    adminApp.use((req,res,next) => {
        let user = req.session.user;
        if(!user){ //判断用户是否存在
           return res.redirect("/user/login");
        }
        adminApp.locals.user = user;
        next();
    })
    const routes = {
        article:require("../controller/admin/article"), //用于文章添加修改
        user:require("../controller/admin/user")//用于用户信息修改
    }

    adminApp.use("/article",routes.article);
    adminApp.use("/user",routes.user);
    return adminApp;
}

module.exports = admin;