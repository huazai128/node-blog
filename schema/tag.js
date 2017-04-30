const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TagSchema = new Schema({
  name:{type:String,default:"",unique:true},
  articles:[{type:ObjectId,ref:"Article"}],
  meta:{
      createTime:{type:Date,default:Date.now},
      updateTime:{type:Date,default:Date.now}
  }
})

TagSchema.pre("save",function(next){
    if(this.isNew){
        this.meta.createTime = this.meta.updateTime = Date.now;
    }else{
        this.meta.updateTime = Date.now;
    }
    next();
})

module.exports = exports.Tag = mongoose.model("Tag",TagSchema);