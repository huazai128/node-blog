let $ = require("jquery");

$(() => {
    $("#back_top").on("click",() => {
        $(".navself").removeClass("is_visible");
    })
})