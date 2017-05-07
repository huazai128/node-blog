const express = require("express");
const path = require("path");
const apiApp = express();

let api = (app) => {
    apiApp.set("views",path.join(__dirname,"../views/main"));
    apiApp.set("view engine","ejs");
    apiApp.locals.env = process.env.NODE_ENV || "dev";
    apiApp.locals.reload = true;
    apiApp.use((req,res,next) => {
        apiApp.locals.user = req.session.user;
        next();
    })
    const routes = {
        user:require("../controller/api/user"),
        main:require("../controller/api/main"),
        showmore:require("../controller/api/showmore")
    }
    apiApp.use('/main',routes.main);
    apiApp.use("/user",routes.user);
    apiApp.use("/showmore",routes.showmore);
    return apiApp;
}
module.exports = api;