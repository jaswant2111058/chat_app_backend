const mongoose=require("mongoose");

const userschema=new mongoose.Schema({

            time: {
                type: String,
                default:(new Date()).getHours()+':'+ (new Date()).getMinutes()+' '+(new Date()).getDate()+"/"+((Number(new Date().getMonth()))+1)
            },
            tweetedBy: {
               name:String,
               email:String
            },
            reactions: [{
                reactedBy:
                {
                    name:String,
                    email:String
                },
                 time: {
                    type: String,
                    default: (new Date()).getHours()+':'+ (new Date()).getMinutes()+' '+(new Date()).getDate()+"/"+((Number(new Date().getMonth()))+1)
                },
                reaction:{
                    type:String,
                }
            }],
            tweet: 
                {
                    type: String
                }
       
});
const usr= new mongoose.model("Data_base_tweets",userschema);
module.exports=usr;