const express = require("express");
const path = require("path");
const router = express.Router();
const marked = require("marked");
const async = require("async");
const db = require("../../module");


let re = /<[^>*]>/g; //

//首页
router.get("/",(req,res,next) => {
    let page = 0,title;
    const count = 6;
    let index = count * page;
     async.parallel([
        function(done){
            db.Article.count((err,count) => {
                done(err,count);
            })
        },
        function(done){
            db.Article.find({})
            .sort({"meta.createTime":-1})
            .limit(count)
            .skip(index)
            .populate("author")  //populate：关联查询用户
            .populate("tag")     //populate：关联查询tag，也可以添加查询条件
            .exec((err,acticles) => {
                acticles.forEach((article,index) => {
                    article.text = marked(article.text);
                    //console.log(article.text)
                    article.text = article.text.replace(re,"");
                    if(article.text.length >= 300){
                        article.text = article.text.substring(0,200)
                        article.text = article.text + "..."
                    }
                })
                done(err,acticles)
            })
        }
    ],function(err,results){
        //console.log(results);
        if(err) return;
        if(req.session.user && req.session.user.signature){
            title = req.session.user.signature
        }else{
            title = "play and have fun"
        }
        res.render("index",{
            title:title,
            len:results[0],
            page:page,
            articles:results[1]
        })
    })
})

//根据ID获取文章详情
router.get("/article/:id",(req,res,next) => {
    let id = req.params.id;  //params获取路由参数;
    let preArticle,nextArticle,len;
    async.parallel([
        function(done){
            //查询10条数据
            db.Tag.find({}).sort({"articles":-1}).limit(10).exec((err,tags) => {
                done(err,tags)
            })
        },
        function(done){
            //查询所有文章
            db.Article.find({}).sort({'meta.createTime': -1}).exec((err,articles) => {
                done(err,articles)
            })
        },
        function(done){
            //根据用户
            db.Article.findByIdAndUpdate({_id:id},{$inc:{pv:1}},{new: true})
                .populate("author","_id name email articles avator pv head poster signature avator role")
                .populate("tag","_id articles name pv")
                .exec((err,article) => {
                    db.User.update({_id:article.author._id},{$inc:{pv:1}}).exec((err,user) => {
                        console.log(article)
                        done(err,article)
                    })
                })
        }
    ],function(err,results){
        let tags = results[0];
        let articles = results[1];
        let article = results[2];
        for(let i = 0 ;i < articles.length;i++){
            //判断文章id是否与当前ID一致
            if(articles[i]._id.toString() == id){
                if(i === 0){
                    preArticle = false;
                    nextArticle = articles[i + 1];
                }else if(i === articles.length - 1){
                    preArticle = articles[i - 1];
                    nextArticle = false;
                }else{
                    preArticle = articles[i - 1];
                    nextArticle = articles[i + 1];
                    break;
                }
            }
        }
        len = results[2].author.articles.length;
        //console.log(results[2].author.articles);
        articles.sort(function(a,b){
            return b.pv - a.pv;  //排序升序；
        });
        articles = articles.slice(0,10); //slice(start,end):返回一个选中的数组；
        article.text = marked(article.text);
        res.render("article",{
            title:article.title,
            article:article,
            articles:articles,
            preArticle:preArticle,
            nextArticle:nextArticle,
            tags:tags,
            len:len
        })
    })
})

//根据作者ID获取发表的文章
router.get("/author/:id",(req,res,next) => {
    let id = req.params.id,
        page = 0,
        len,title;
    const count = 6;
    let index = count * page;
    db.User.findById({_id:id})
        .populate("articles")
        .exec((err,user) => {
            if(err){
                console.log(err);
                return res.redirect("/");
            }
            len = user.articles.length; //用户发表的文章数量
            user.articles.sort((a,b) => {
                return b.meta.createTime - a.meta.createTime;
            })
            //slice():返回选中的数组；
            user.articles = user.articles.slice(index,index + count);
            user.articles.forEach((article,index) => {
                article.text = marked(article.text);
                article.text = article.text.replace(re,""); //替换
                if(article.text.length > 200){
                    article.text = article.text.substring(0,200);
                    article.text = article.text + "...";
                }
            })
            if(user.signature){
                title = user.signature;
            }else{
                title = user.name;
            }
            res.render("author",{
                title:title,
                len:len,  //用户发表的文章数量
                page:page, //当前页码
                user:user
            })
        })    
})

//根据tagID获取所有文章
router.get("/article/tag/:id",(req,res) => {
    let id = req.params.id,
        page = parseInt(req.query.p,10) || 0,
        len;
    const count = 6;
    let index = count * page;
    async.parallel([
        function(done){
            db.Tag.findById({_id:id}).populate("articles").exec((err,tag) => {
                done(err,tag)
            })
        },
        function(done){
            db.Tag.find({}).exec((err,tags) => {
                done(err,tags)
            })
        }
    ],function(err,results){
        if(err){
            console.log(err);
            return res.redirect("/");
        }
        let tag = results[0];
        let tags = results[1];
        len = tag.articles.length;
        tag.articles = tag.articles.slice(index,index + count);
        res.render("tag",{
            title:tag.name,
            tags:tags,
            tag:tag
        })
    })  
})



module.exports = router;