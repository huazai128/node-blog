const express = require("express");
const path = require("path");
const mainApp = express();
mainApp.locals.moment = require("moment"); //日期处理；

let main = (app) => {
    mainApp.set("views",path.join(__dirname,"../views/main"));
    mainApp.set("view engine","ejs");
    mainApp.locals.env = process.env.NODE_ENV || "dev";
    mainApp.locals.reload = true;
    mainApp.use((req,res,next) => {
        let _user = req.session.user; //获取session
        mainApp.locals.user = _user;
        next();
    });
    //GET首页、登录、注册页面
    const routes = {
        main:require("../controller/main/main"),
        user:require("../controller/main/user")
    }
    mainApp.use("/",routes.main);
    mainApp.use("/user",routes.user);
    return mainApp
}

module.exports = main;