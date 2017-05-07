require("../css/login_reg.css");
let $ = require("jquery");
let user = require("./common/user.js");
let canvas = require("./common/canvas.js");

$(() => {
    let rf,$vers;
    //向元素附加数据，然后取回该数据：
    $("#signupName").data("message","用户名不能为空");
    $("#email").data("email","邮箱不能为空");
    $("#signupPwd").data('message', '密码不能为空');
	$("#confirmPwd").data('message', '重复密码不能为空');

    //失去焦点时触发
    $("#signupName").blur(function(){
        user.verification($(this));
    });

    $("#email").blur(function(){
        user.verification($(this));
    })

    $("#signupPwd").blur(function(){
        user.verification($(this));
    })

    $("#confirmPwd").blur(function(){
        user.verification($(this));
    });

    $("#reg_btn").on("click",() => {
        user.verification($("#signupName"));
        user.verification($("#email"));
        user.verification($("#signupPwd"));
        user.verification($("#confirmPwd"));
        console.log($(this));
        rf = true;
        $vers = $(".reg_form").find(".ver");
        for(let i = 0;i < $vers.length;i++){
            console.log($vers.eq(i));
            if(!$vers.eq(i).data("onoff")){  //eq(index):arr[index]
                $vers.eq(i).css("backgroundColor","#FCFCD6");
                user.showError($vers.eq(i));
                rf= false;
            }
        }
        return rf;
    })


    //---------- canvas ------------
    let w = document.documentElement.clientWidth,
        h = document.documentElement.clientHeight - 50,
        Canvas = document.getElementById("regCanvas"),
        ctx = Canvas.getContext("2d"),
        dxdy = [],
        allRound = [];
    Canvas.width = w;
    Canvas.height = h;
    $('.reg_form').css('left', (w - $('.reg_form').innerWidth()) / 2 + 'px');
	$('.reg_form').css('top', (h - $('.reg_form').innerHeight()) / 2 + 'px');
    canvas.initRound(canvas.Round, Canvas, allRound);
	canvas.roundMove(Canvas, ctx, dxdy, allRound);
})

