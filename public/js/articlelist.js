require("../css/article.css");
let $ = require("jquery");
$(() => {
  $(".del").on("click",(ev) => {
      let target = $(ev.target);
      let id = target.data("id");
      let cls = $(".article-"+id);
      $.ajax({
          type:"DELETE",
          url:"/api/main/delete?id="+ id,
      }).done((results) => {
          console.log(results);
          if(results.success){
              cls.hide("slow").remove();
          }
      })
  })  
})