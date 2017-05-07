const express = require("express");
const router = express.Router();
const db = require("../../module");

//GET发表文章
router.get("/post",(req,res,next) => {
    res.render("post",{
        title:"发表文章",
        article:{}
    })
});


//GET获取用户信息
router.get("/author/:id",(req,res,next) => {
    let id = req.params.id; // 获取路由参数;
    //判断用户是否满足当前请求要求。
    if(req.session.user._id !== id  ){
        return res.redirect("back");
    }
    //根据用户ID获取，获取当前用户所有的文章
    db.Article.find({author:id})
        .sort({"meta.createTime":-1})
        .populate("author") //根据文章author查询用户
        .populate("tag")
        .exec((err,articles) => {
            if(err){
                console.log(err);
                return res.redirect("/");
            }
            console.log(articles);
            res.render("articlelist",{
                title:"文章列表",
                articles:articles
            })
        })
})

//GET文章编辑
router.get("/edit/:id",(req,res,next) => {
    let id = req.params.id;  //获取文章Id
    if(id){
        db.Article.findById({_id:id})
        .populate("tag")
        .exec((err,article) => {
            if(err){
                console.log(err);
                return res.redirect("/")
            }
            res.render("post",{
                title:"修改文章",
                article:article
            })
        })    
    }
});




module.exports = router

