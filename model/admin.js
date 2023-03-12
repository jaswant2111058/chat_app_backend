const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
       unique:[true,"email already exist"]
    },
    email_status:{
        type:Boolean
    },
    password:{
        type:String,
    },
    type:{
        type:String,
        default:'admin'
    },
    otp:{
        type:String,
        timestamps:true
    },
    
    createdAt:{type:Date,default:Date.now,index:{expires:30}}
});
const usr= new mongoose.model("Data_base_user",userschema);
module.exports=usr;