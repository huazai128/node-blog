const express = require("express");
const path = require("path");
const managerApp = express();

let manager = (app) => {
    //视图
    managerApp.set("views",path.join(__dirname,"../views/manager"));
    managerApp.set("view engine","ejs");
    managerApp.locals.env = process.env.NODE_ENV || "dev";
    managerApp.locals.reload = true;
    managerApp.use((req,res,next) => {
        let _user = req.session.user; //获取session
        managerApp.locals.user = _user;
        if(user && _user.role > 50){
            next();
        }else{
            return res.redirect("back")
        }
    });

    const routes = {
        main:require("../controller/manager/main")
    }
    managerApp.use("/",routes.main)
    return managerApp;
}


module.exports = manager;