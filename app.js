const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const mongoStore = require("connect-mongo")(session);
const app = express();
const reload = require("reload");
const http = require("http");
const db = require("./config/connect");
const port = process.env.PORT || 3000;

//链接数据库
db.open();
app.on("close",function(){
    db.close();
});

let isDev = process.env.NODE_ENV !== "production";
app.locals.env = process.env.NODE_ENV || "dev"; //
app.locals.reload = true;

app.set("views",path.join(__dirname,"views"));//模版引擎
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public"))); //静态文件

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({ //session 缓存可以用radio
    secret:"HDSD-FSDS",//防止cookie被窃取
    key:"blog",
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge: 1000 * 60 * 60 * 24},
    store:new mongoStore({ //session缓存
        url:"mongodb://localhost/store",
        collection:"sessions"
    })
}));

app.use((req,res,next) => {
    let _user = req.session.user;
    app.locals.user = _user;  //可以直接在页面获取数据
    next();
})

if(isDev){
    console.log(isDev);
    const webpack = require("webpack");
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackDevConfig = require('./webpack.config.js');
    let compiler = webpack(webpackDevConfig);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));

    const main = require("./routes/main")(app);
    const api = require("./routes/api")(app);
    const admin = require("./routes/admin")(app);
    const manager = require("./routes/manager")(app);

    app.use("/",main);
    app.use("/admin",admin);
    app.use("/api",api);
    app.use("/manager",manager);

    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                title: '你来到了一片荒芜之地',
                message: err.message,
                error: err
            });
        });
    }

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title: '你来到了一片荒芜之地',
            message: err.message,
            error: {}
        });
    });

    let server = http.createServer(app);
    reload(server,app);

    server.listen(port,function(){
        console.log("listen = ",port);
    });
}else{
    console.log(isDev);
    app.use(express.static(path.join(__dirname, 'public')));
    const main = require("./routes/main")(app);
    const api = require("./routes/api")(app);
    const admin = require("./routes/admin")(app);
    const manager = require("./routes/manager")(app);
    //模块挂载
    app.use('/', main);
    app.use('/admin', admin);
    app.use('/api', api);
    app.use('/manager', manager);



    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });


    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.log(err);
        res.render('error', {
            title: '你来到了一片荒芜之地',
            message: err.message,
            error: err
        });
        });
    }

    // // production error handler
    // // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.log(err)
        res.render('error', {
        title: '你来到了一片荒芜之地',
        message: err.message,
        error: {}
        });
    });
    app.listen(port);
    console.log('Blog satrt on port:' + port);
    module.exports = app;
}

