const express = require("express");
const router = express.Router();
const db = require("../../module");

router.get("/",(req,res) => {
    db.User.find({},(err,users) => {
        if(err){
            console.log(err);
        }
        res.render("config",{
            title:"管理中心",
            users:users
        })
    })
});

module.exports = router;