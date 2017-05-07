module.exports = (() => {
    //验证用户名
    let isUser = (aUser) => {
        return (RegExp(/^\w{4,20}/).test(aUser) ? true : false);
    }
    //验证email
    let isEmail = (aEmail) => {
        var rg = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)
        return rg.test(aEmail) ? true : false;
    }
    //验证密码
    let isPassword = (aPassword) => {
        return RegExp(/^\w{6,20}/).test(aPassword) ? true : false;
    }
    //显示错误
    let showError = ($obj) => {
        //获取元素附加数据
        $obj.next().html($obj.data("message")).fadeIn();
    }
    //表单验证
    let _ajax = (obj,_url) => { //obj == $(this);指向当前表单元素
        $.ajax({
            url:_url,
            data:{
                email:obj.val(),
                username:obj.val()
            },
            dataType:"json",
            success:function(data){
                console.log(data.errorCode); // 0：为false
                if(data.errorCode){//验证失败
                    obj.data("onoff",false);
                    obj.data("message",data.message);
                    showError(obj);
                    return
                }else{  //验证通过
                    obj.data("onoff",true);
                }
            }
        })
    }

    //注册认证
    let verification = (obj,url) => {
        var aVal = obj.attr("name"); //获取元素属性name值
        obj.next().html("");
        if(obj.val() == ""){
            obj.next().html("")
            showError(obj);//
            return;
        }
        console.log(aVal);
        //验证用户名
        if(aVal == "user[name]"){
            if(!isUser(obj.val())){//没有通过格式验证
                obj.data("onoff",false);//给元素添加附加数据
                obj.data("message","用户名格式不对");
                showError(obj);
                return;
            }
            //验证用户名是否存在
            _ajax(obj,'/api/user/username');
        }
        //验证email
        if(aVal == "user[email]"){
            if(!isEmail(obj.val())){
                obj.data("onoff",false);
                obj.data("message","邮箱格式不对");
                showError(obj);
                return
            }
            _ajax(obj,"/api/user/email");
        }
        if(aVal == 'user[password]'){
            console.log(isPassword(obj.val()))
            if(!isPassword(obj.val())){
                obj.data("onoff",false);
                obj.data("message","密码为6-20字母或者数字组");
                showError(obj);
            }else{
                obj.data("onoff",true);
            }
        }
        if(obj.val() !== $("#signupPwd").val() && aVal == "user[confirmpwd]"){  
            obj.data("onoff",false);
            obj.data("message","两次密码不一致");
            showError(obj);
        }else{
            obj.data("onoff",true);
        }
    }

    let loginfication = () => {

    }

    return{
        verification:verification,
        showError:showError,
        loginfication:loginfication
    }
})()