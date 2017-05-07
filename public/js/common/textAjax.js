module.exports = (() => { //闭包函数
    /**
     * 
     * @param {*} name 用户名
     * @param {*} data 数据
     * @param {*} parent 
     */
    let createTextList = (name,data,parent) => {
        $(
            '<div class="post-preview">' +
			'<a href="/article/' + data._id + '">' +
			'<h2 class="post-title">' + data.title + '</h2>' +
			'<div class="post-content-preview">' + data.text + '</div>' +
			'</a>' +
			'<p class="post-meta">' +
			'Posted by' +
			' <a href="/author/' + data.author._id + '">' + name + '</a>' +
			' on ' + data.meta.updateTime +
			'<span>' + data.pv + '浏览</span>' +
			'</p>' +
			'</div>' +
			'<hr />'
        ).appendTo($(parent)).hide().show("slow")
    }
    /**
     * 
     * @param {*} page 当前页码输
     * @param {*} btn  显示更多按钮
     * @param {*} url  url
     * @param {*} parent 父元素
     * @param {*} moment 日期格式化组件 
     */
    let getTextMore = (page,btn,url,parent,moment) => {
        let showmore,time;
        $.ajax({
            type:"GET",
            url:url + page.value
        }).done((results) => {
            console.log(results);
            showmore = results.showmore;
            
            results.articles.forEach((article,index) => {
                time = article.meta.updateTime
                article.meta.updateTime = moment(article.meta.updateTime).format("YYYY-MM-DD HH:mm:ss")
                if(article.author.name){
                    name = article.author.name;
                }else{
                    name = results.name                    
                }
                createTextList(name,article,parent)
            })
            if(showmore.len <= (showmore.page * showmore.count) + results.articles.length){
                $(btn).hide();
            };
            page.value++;
        })
    }
    return {
        getTextMore:getTextMore
    }
})();
