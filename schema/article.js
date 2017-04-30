const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
console.log("到底保存了")

const ArticleSchema = new Schema({
    author:{type:ObjectId,ref:"User"},
    title:{type:String,default:""},
    text:{type:String,default:""},
    tag:{type:ObjectId,ref:"Tag"},
    pv:{type:Number,default:0},
    meta:{
        createTime:{type:Date,default:Date.now},
        updateTime:{type:Date,default:Date.now}
    }
})

ArticleSchema.pre("save",function(next){
    console.log("开始保存");
    if(this.isNew){
        this.meta.createTime = this.meta.updateTime = Date.now;
    }else{
        this.meta.updateTime = Date.now;
    }
    next();
})


ArticleSchema.statics = {
    fetch:function(cd){
        return this.find({})
            .sort({"meta.createTime": -1})
            .exec()
    }
}

module.exports = exports.Article = mongoose.model("Article",ArticleSchema);