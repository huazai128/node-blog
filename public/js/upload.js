$(() => {
    let img = document.getElementById("img");
    //判断浏览器是非支持HTML5上传
    if(!window.File && !window.FileList && !window.FileReader && !window.Blob){
        $(".upload_info").html("您的浏览器不支持HTML5上传");
        $(".upload_info").show();
    }
    $("#upload_img img").on("drag", ev => {
        let e = ev || event; 
        e.preventDefault(); //取消事件默认动作
    })
    $("#upload_img img").on("dragenter",ev => {
        let e = ev || event; 
        e.preventDefault(); //取消事件默认动作
    });
    $("#upload_img img").on("dragover", ev => {
        let e = ev || event; 
        e.preventDefault(); //取消事件默认动作
    });
    //使用拖拽上传
    $("#upload_img img").on("drop", (ev) => {
        if(!img.files[0]){
            $(".upload_info").html("请选择上传图片");
            $(".upload_info").show();
            return;
        }else{
            $(".upload_info").html("");
            $(".upload_info").hide();
        };
        let e = ev || window.event;; 
        e.preventDefault(); //取消事件默认动作
        let xhr = new XMLHttpRequest();  //http请求
        //加载
        xhr.onload = () => {
            let data = JSON.parse(this.responseText);
            console.log(data);
            message.innerHTML = "上传成功";
            $("#upload_img img").attr("src",data.path);
        }
        //上传方法和url
        xhr.open("POST","/api/main/avator",true);
        //开始上传
        xhr.upload.onloadstart = () => {
            console.log("开始上传")
        }
        //上传进度
        xhr.upload.onprogress = (ev) => {
            console.log("正在上传：" + ev.loaded + "/" + ev.total);
            let a = ev.loaded / ev.total;
            console.log(a);
            $("#upload_img .progress-bar").css("width",(a * 100) + "%");
            $("#upload_img .progress-bar").html(parseInt(a * 100) + "%");
        }
        //上传完成
        xhr.upload.onload = (ev) => {
            console.log("上传完成");
             $("#upload_img .progress-bar").css("width","100%");
             $("#upload_img .progress-bar").html("上传完成");
        }
        //form表单
        let fd = new FormData();//使用FormData对象；它可以更灵活方便的发送表单数据
        console.log(ev);
        fd.append("f",img.files[0]); //添加发送字段
        xhr.send(fd); //
    });

    //点击上传
    $("#upload_img .btn").on("click",(ev) => {
        let e = ev || window.event;
        e.preventDefault();  //取消事件默认行为
        if(!img.files[0]){
            $(".upload_info").html("请选择上传图片");
            $(".upload_info").show();
            return;
        }else{
            $(".upload_info").html("");
            $(".upload_info").hide();
        }
        let xhr = new XMLHttpRequest();
        //上传成功调用
        xhr.onload = function(){
			console.log(this.responseText);
			let data = JSON.parse(this.responseText);
			$('#upload_img img').attr('src', data.path);
		}
        //开始上传
        xhr.upload.onloadstart = () => {
            console.log("开始上传");
        }
        //上传进度
        xhr.upload.onprogress = (ev) => {
            console.log("上传进度:" + ev.loaded + "/" + ev.total);
            let a = ev.loaded / ev.total;
            $("#upload_img .progress-bar").css({width: parseInt(a * 100) + "%"});
            $("#upload_img .progress-bar").html(parseInt(a * 100) + "%");
        }
        //上传完成
        xhr.upload.onload = () => {
            console.log('上传完成');
			$('#upload_img .progress-bar').css('width','200px');
			$('#upload_img .progress-bar').html('上传完成');
        }
        xhr.open("post","/api/main/avator",true);
        let form = new FormData();
		form.append('f', img.files[0]);
		xhr.send(form);
    });
})