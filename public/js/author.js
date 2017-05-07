require('../css/author_index.css');
let $ = require("jquery");
let moment = require("moment");
let textAjax = require("./common/textAjax");

module.exports = $(()=> {
    $("#author_showmore").on("click",() => {
        //undefined：表示变量未初始化，变量默认的值为undefined；
        //null:表示未存在对象，返回一个undefined；undefined是null派生类；
        console.log(undefined == null); //true；判断两个值;
        console.log(undefined === null) //false;判断两个类型
        let page = {
            value:1
        }
        console.log(window.location.href);
        let authorId = window.location.href.slice(window.location.href.lastIndexOf("/") + 1);
        textAjax.getTextMore(page,"#author_showmore","/api/showmore/author?id="+ authorId +"&p=","#author_content",moment);
    })
});
