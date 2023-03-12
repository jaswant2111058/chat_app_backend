const express = require("express");
const router = express.Router();
const tweets = require("../model/tweets")
const user = require("../model/user")
const isLoggedIn = require("../middleware/middleware");


router.post("/posts/:token", isLoggedIn, async (req, res) => {
    try {

        const AllChats = await tweets.find({})
        res.send(AllChats)
    }
    catch (e) {
        res.status(400).send(e);
    }
})
router.post('/newPost/:token', isLoggedIn, async (req, res) => {
    try {
        console.log(req.body)
        const newChat = req.body;
        const detail = new tweets(newChat)
        await detail.save();
        console.log(newChat)
        res.send(newChat)
    }
    catch (e) {
        res.status(400).send(e);
    }
})

router.post('/tweetReaction/:token', isLoggedIn, async (req, res) => {
    try {
        console.log(req.body)
        const { chatId, reaction } = req.body
        const chat = await tweets.findOne({ _id: chatId })
        chat.reactions.push(reaction)
        await tweets.updateOne({ _id: chatId }, { reactions: chat.reactions })
    }
    catch (e) {
        res.status(400).send(e);
    }
})

router.post('/tweetDelete/:token', isLoggedIn, async (req, res) => {
    try {
        const chatId = req.body.id
        const dlt = await tweets.remove({ _id: chatId });
        console.log(dlt)
    }
    catch (e) {
        res.status(400).send(e);
    }
})
module.exports = router;
