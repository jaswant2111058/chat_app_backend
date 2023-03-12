const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
     //  unique:[true,"email already exist"]
    },
    email_status:{
        type:Boolean
    },
    password:{
        type:String,
    },
    type:{
        type:Boolean,       //ture for admin and false for simple users
        default:false
    },
    otp:{
        type:String,
        timestamps:true
    },
    
});
const usr= new mongoose.model("data-user",userschema);
module.exports=usr;