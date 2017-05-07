require("../css/author_index.css");
let $ = require("jquery");
let moment = require("moment");
let textAjax = require("./common/textAjax");

module.exports = $(() => {
    let page = {
        value : 1
    }
    $("#index_showmore").on("click",() => {
        textAjax.getTextMore(page,"#index_showmore","/api/showmore/index?p=","#index_content",moment);
    })
})