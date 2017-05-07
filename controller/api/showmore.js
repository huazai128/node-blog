//各种页面加载更多数据
const express = require("express");
const router = express.Router();
const db = require("../../module");
const marked = require("marked");
const async = require("async");

let re = /<[^>]*>/g;


//首页显示更多
router.get("/index",(req,res) => {
    let page = parseInt(req.query.p,10) || 1,
        len
    const count = 6; 
    let index = page * count;
    async.parallel([
        function(done){
            db.Article.find({}).exec((err,articles) => {
                done(err,articles)
            })
        },
        function(done){
            db.Article.find({})
            .skip(index)
            .limit(count) //限制查询多少条
            .sort({"meta.createTime":-1})
            .populate("author")
            .populate("tag")
            .exec((err,articles) => {
                articles.forEach((article,index) => {
                    article.text = marked(article.text);
                    article.text = article.text.replace(re,"");//替换
                    if(article.text.length){
                        article.text = article.text.substring(0,200);
                        article.text = article.text + "..."
                    }
                    
                });
                done(err,articles)
            })
        }
    ],function(err,results){
        let len = results[0].length;
        res.json({
            articles:results[1],
            showmore:{
                page:page,
                len:len,
                count: count
            }
        })
    })
})

//根据用户Id查询更多数据
router.get("/author",(req,res,next) => {
    let id = req.query.id;
    let page = parseInt(req.query.p,10) || 1;
    let len;
    const count = 6;
    let index = page * count;
    async.parallel([
        function(done){
            db.User.findOne({_id:id}).exec((err,user) => {
                done(err,user)
            })
        },
        function(done){
            db.Article.find({author:id}).exec((err,articles) => {
                done(err,articles);
            })
        },
        function(done){
            db.Article.find({author:id})
                .sort({"meta.createTime":-1})
                .skip(index)
                .limit(count)
                .exec((err,articles) => {
                    done(err,articles);
                })
        }
    ],function(err,results){
        if(err){
            return res.json({
                message:"错误了"
            })
        }
        let name = results[0].name;
        res.json({
            articles:results[2],
            name:name,
            showmore:{
                page:page,
                len:results[1].length,
                count:count
            }
        })
    })  
})


//根据标签ID查询更多tag文章


module.exports = router;

















// let page = parseInt(req.jquery.p,10) || 1,
    //     len,time;
    // console.log(page)
    // const count = 6;
    // async.parallel([
    //     function(done){
    //         db.Article.find({}).exec((err,articles) => {
    //             done(err,articles)
    //         })
    //     },
    //     function(done){
    //         db.Article.find({})
    //             .skip(page * count)
    //             .limit(count)
    //             .sort({"meta.createTime":-1})
    //             .populate("author")
    //             .populate("tag")
    //             .exec((err,articles) => {
    //                 articles.forEach((article,index) => {
    //                     article.text = marked(article.text);
    //                     article.text = article.text.replace(re,"");//替换
    //                     if(article.text.length > 200){
    //                         article.text = article.tarticle.text.sunstring(0,200);
    //                         article.text = article.text + "..."
    //                     }
    //                 })
    //                 done(err,articles)
    //             })
    //     }
    // ],function(err,results){
    //     len = results[0].length;
    //     res.json({
    //         articles:results[0],
    //         showmore:{
    //             page:page,
    //             len:len,
    //             count:count
    //         }
    //     })
    // })