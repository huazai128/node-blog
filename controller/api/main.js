const express = require("express");
const marked = require("marked");
const _ = require("underscore");
const multer = require("multer"); //文件上传插件
const fs = require("fs");         //文件操作
const path = require("path");
const async = require("async");
const router = express.Router();
const db = require("../../module");

//上传文件配置
let storage = multer.diskStorage({ //使用磁盘存储引擎来控制文件的存储
    //保存路径
    destination: function (req, file, cb) {
		cb(null, '../../public/upload');//创建文件目录
	},
    //上传文件名
    filename:function(req,file,cb){
        //console.log(file);  //查看文件信息
		let ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
		cb(null, Date.now() + ext);
    }
})
let upload = multer({
	storage: storage
});

upload = upload.single('f');


//添加或者修改文章
router.post("/post",(req,res,next) => {
    console.log("============================")
    let articleObj = req.body.article,
        _title = articleObj.title,
        _tag = articleObj.tag,
        _text = articleObj.text,
        _id = articleObj._id, //当前文章的ID
        currentUser = req.session.user,
        _article;
    //判断文章是修改还是添加
    if(_id){//修改文章
        db.Tag.findOne({name:_tag},(err,tag) => {
            if(err){
                console.log(err);
                return res.redirect("/admin/article/post");
            }
            //判断标签是否存在
            if(tag){ //标签存在
                db.Article.findById({_id:_id}).then((article) => {
                    //判断标签是否一致
                    if(article.tag.toString() == tag._id){
                        articleObj.tag = article.tag; //
                        console.log(articleObj.tag);    
                     }else{ //标签不一致，说明已修改标签，删除原有标签中的文章
                        articleObj.tag = tag._id;
                        db.Tag.findOne({_id:article.tag}).then((tag) => {
                            console.log("1")
                            //遍历当前标签下所有的文章
                            for(let i = 0; i < tag.articles.length; i++){
                                //判断当前文章id
                                if(tag.articles[i].toString() == article._id){
                                    tag.articles.splice(i,1);//在当前标签下删除当前文章信息
                                    break;
                                }
                            }
                            //当前标签下是否存在文章
                            if(!tag.articles.length){ 
                                //删除标签
                                db.Tag.remove({_id:tag._id},(err,tag) => {
                                    if(err){
                                        consoe.log(err);
                                        return res.redirect('/admin/article/post');
                                    }
                                    console.log("删除成功");
                                })
                            }else{
                                //重新保存tag
                                tag.save((err,tag) => {
                                    if(err){
                                        console.log(err);
                                        return res.redirect('/admin/article/post');
                                    }
                                }) 
                            }
                        }).then(() => {
                            console.log("2");
                            //在修改后的标签中添加文章ID
                            db.Tag.findById({_id:tag._id}).then((tag) => {
                                tag.articles.push(article._id);
                                tag.save((err,tag) => {
                                    if(err){
                                        console.log(err);
                                        return res.redirect('/admin/article/post');
                                    }
                                })
                            })
                        })
                    }
                    //extend():继承
                    _article = _.extend(article,articleObj);
                    console.log(_article);
                    _article.save((err,article) => {
                        if(err){
                            console.log(err);
							return res.redirect('/admin/article/post');
                        }
                        res.redirect("/article/" + article._id)
                    })
                })
            }else{ //如果标签不存在
                let tagname = _tag;
                //首先要把文章tag删除
                db.Article.findById({_id:_id}).then((article) => {
                    db.Tag.findOne({_id:article.tag}).then((tag) => {
                        if(err){
                            console.log(err);
                            return res.redirect("/admin/article/post");
                        }
                        for(let i = 0; i < tag.articles.length; i++){
                            //判断文章ID和当前标签中文章ID相同
                            if(tag.articles[i].toString() == article._id){
                                tag.articles.splice(i,1);
                                break;
                            }
                        }
                        if(!tag.articles.length){
                            db.Tag.remove({_id:article.tag},(err,tag) => {
                                if(err){
                                    console.log(err);
                                    return res.redirect("/admin/article/post")
                                }
                            })
                        }else{
                            tag.save((err,tag) => {
                                if(err){
                                    console.log(err);
                                    return res.redirect("/admin/article/post")
                                }
                            })
                        }
                    }).then(() => {
                        db.Article.findById({_id:_id}).then((article) => {
                            if(err){
                                console.log(err);
                                return res.redirect('/admin/article/post');
                            }
                            let _tag = new db.Tag({
                                name:tagname
                            })
                            //在当前标签下添加文章ID
                            _tag.articles.push(_id);
                            articleObj.tag = _tag._id;
                            _article = _.extend(article,articleObj);
                            _tag.save((err,tag) => {
                                if(err){
                                    console.log(err);
                                    return res.redirect("/admin/article/post");
                                }
                                _article.save((err,article) => {
                                    if(err){
                                        console.log(err);
                                        return res.redirect("/admin/article/post")
                                    }
                                    return res.redirect("/article/" + article._id)
                                })
                            })
                        })
                    })
                })
            }
        })
    }else{ //添加新的文章
        let tagname = _tag;
        db.Tag.findOne({name:_tag},(err,tag) => { //判断标签是否存在
            if(err){
                console.log(err);
                return res.redirect("/admin/article/post")
            }
            if(!tag){ //标签没有存在就创建一个
                console.log("标签不存在");
                let _tag = new db.Tag({ 
                    name:tagname
                })
                let _article = new db.Article({
                    author:currentUser,
                    title:_title,
                    text:_text,
                    tag:_tag._id
                })
                _tag.articles.push(_article._id);
                _tag.save((err,tag) => {
                    if(err){
                        console.log(err);
                        return res.redirect("/admin/article/post")
                    }
                    console.log("保存了1");
                    _article.save((err,article) => {
                        if(err){
                            console.log(err);
                            return res.redirect("/admin/article/post")
                        }
                        //在当前用户中添加文章和标签
                        db.User.findById({_id:currentUser._id},(err,user) => {
                            if(err){
                                console.log(err);
                                return res.redirect("/admin/article/post")
                            }
                            user.articles.push(article._id);
                            user.save((err,user) => {
                                if(err){
                                    console.log(err);
                                    return res.redirect("/admin/article/post")
                                }
                                console.log("success");
                                res.redirect("/article/" + article._id)
                            })
                        })
                    })
                })
            }else{ //标签存在
                let _article = new db.Article({
                    author:currentUser,
                    title:_title,
                    text:_text,
                    tag:tag._id
                })
                tag.articles.push(_article._id);
                tag.save((err,tag) => {
                    if(err){
                        console.log(err);
                        return res.redirect("/admin/article/post")
                    }
                    console.log("保存了2");
                    _article.save((err,article) => {
                        if(err){
                            console.log(err);
                            return res.redirect("/admin/article/post")
                        }
                        console.log("文章保存2");
                        db.User.findById({_id:currentUser._id},(err,user) => {
                            if(err){
                                console.log(err);
                                return res.redirect("/admin/article/post")
                            }
                            user.articles.push(article._id);
                            user.save((err,user) => {
                                
                                if(err){
                                    console.log(err);
                                    return res.redirect("/admin/article/post")
                                }
                                res.redirect("/article/" + article._id)
                            })
                        })
                    })
                })
            }
        })
    }
})

//修改用户简介
router.post("/signature",(req,res,next) => {
    let user = req.body.user,
        name = user.name,
        signature = user.signature,
        id = req.session.user._id;
    db.User.findById({_id:id}).exec((err,user) => {
        if(err){
            console.log(err);
            return res.redirect("/admin/article/setprofile");
        }
        user.name = name;
        if(signature){
           user.signature = signature;
        }
        user.save((err,user) => {
            if(err){
                console.log(err);
                return res.redirect("/admin/article/setprofile");
            }
            req.session.user = user; //重新保存session数据
            res.redirect("/");
        })
    })
});

//上传照片
router.post('/avator', (req, res) => {
    console.log(req.files);
	upload(req,res,(errs) => {
        //console.log(req.file);//为什么获取不到前台提交的数据
		db.User.findOne({_id: req.session.user._id})
			.exec((err, user) => {
				if (user.avator) {
                    console.log("===")
					let preavator = user.avator;
                    //unlinkSync(path);同步删除
					fs.unlinkSync(path.join(__dirname, '../../public/upload/' + preavator));
				}
				// user.avator = req.file.filename;
				// user.save((err, user) => {
				// 	if (err) {
				// 		console.log(err);
				// 	}
				// 	req.session.user = user;
				// 	let path = req.file.path.substring(req.file.path.indexOf('/'))
				// 	res.json({
				// 		errorCode: 0,
				// 		message: '上传成功',
				// 		path: path
				// 	})
				// })
			})
	})
});

//修改密码
router.post("/pwd",(req,res,next) => {
    let data = req.body.user,
        _password = data.password,
        _newpwd = data.newpwd,
        _confirmpwd = data.confirmpwd;
    db.User.findOne({_id:req.session.user._id}).exec((err,user) => {
        console.log(user);
        user.comparePassword(_password,(err,isMatch) => {
            if(err){
                console.log(err);
                return res.redirect("/admin/user/resetpwd");
            }
            //密码验证通过
            if(isMatch){
                user.password = _newpwd;
                user.confirmpwd = _confirmpwd;
                user.resetPwd().then(() => {
                    res.render("../admin/password",{
                        title:"个人中心",
                        message:"修改成功"
                    });
                }).catch((err) => {
                    let errorMessage;
                    switch(err){
                        case user.PASSWORD_IS_NOT_VALIDATE:
                            errorMessage = "密码格式不正确";
                            break;
                        case user.TWO_PASSWORD_IS_NOT_MATCH:
                            errorMessage = "两次输入的密码不一致";
                            break;
                        default:
                            errorMessage = "发生了点意外";
                            break;
                    }
                    res.render("../admin/password",{
                        title:"个人中心",
                        message:errorMessage
                    })
                })
            }else{
                res.render("../admin/password",{
                    title:"个人中心",
                    message:"密码错误"
                })
            }
        })
    })
})

//根据文章ID删除；
router.delete("/delete",(req,res,next) => {
    let id = req.query.id;
    if(id){
        //根据当前文章ID查询数据
        db.Article.findById({_id:id}).then((article) => {
            //根据文章中保存的用户ID来查询用户数据
            db.User.findById({_id:article.author}).exec((err,user) =>{
                //判断是否为当前用户
                if(req.session.user._id !== user.id && req.session.user.role < 50){
                    return res.redirect("back");
                }
                //遍历当前用户下所有的文章
                for(let i = 0;i < user.articles.length;i++) {
                    //如果和当前文章ID相等删除
                    if(user.articles[i].toString() ==  article._id){
                        user.articles.splice(i,1);//
                        break;
                    }
                }
                //重新保存数据
                user.save(() =>{
                    if(err){
                        console.log(err);
                    }
                })
            })
            return article;
        }).then((article) => {
            //根据文章ID查询tag数据
            db.Tag.findById({_id:article.tag}).exec((err,tag) => {
                //遍历当前标签下所有文章
                for(let i = 0;i < tag.articles.length;i++){
                    if(tag.articles[i] == article._id){ //相同删除
                        tag.articles[i].splice(i,1);
                        break;
                    }
                }
                //判断当前标签下是否有文章
                if(!tag.articles.length){
                    db.Tag.remove({_id:tag._id}).exec((err,tag) => {
                        if(err){
                            console.log(err);
                        }
                    })
                }else{
                    tag.save((err,tag) => {
                        if(err){
                            console.log(err);
                        }
                    })
                }
                
            })
        }).then(() => {
            //删除文章
            db.Article.findByIdAndRemove({_id:id}).exec((err,article) => {
                if(err){
                    console.log(err)
                }else{
                    res.json({
                        success: true
                    })
                }
            })
        })
    }
})

module.exports = router;