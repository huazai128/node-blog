//各种页面加载更多数据
const express = require("express");
const router = express.Router();
const db = require("../../module");
const marked = require("marked");
const async = require("async");

let re = /<[^>]*>/g;

router.get("/index",(req,res) => {
    let page = parseInt(req.jquery.p,10) || 1,
        len,time;
    const count = 6;
    async.parallel([
        function(done){
            db.Article.find({}).exec((err,articles) => {
                done(err,articles)
            })
        },
        function(done){
            db.Article.find({})
                .skip(page * count)
                .limit(count)
                .sort({"meta.createTime":-1})
                .populate("author")
                .populate("tag")
                .exec((err,articles) => {
                    articles.forEach((article,index) => {
                        article.text = marked(article.text);
                        article.text = article.text.replace(re,"");//替换
                        if(article.text.length > 200){
                            article.text = article.tarticle.text.sunstring(0,200);
                            article.text = article.text + "..."
                        }
                    })
                    done(err,articles)
                })
        }
    ],function(err,results){
        len = results[0].length;
        res.json({
            articles:results[0],
            showmore:{
                page:page,
                len:len,
                count:count
            }
        })
    })
})


module.exports = router;