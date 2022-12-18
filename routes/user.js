const User = require("../models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


//^UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            //update the user
            $set: req.body
            //we need to use new in order for the updated user to be returned
        }, {new: true})
        res.status(200).json(updatedUser)
    }
    catch(err) {
        res.status(500).json(err);
    }
})

//!DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...")
    } catch(err) {
        res.status(500).json(err)
    }
})

//GET USER
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user =  await User.findById(req.params.id)

        const {password, ...others} = user._doc
        res.status(200).json(others)
    } catch(err) {
        res.status(500).json(err)
    }
})


//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users =  query 
            ? await User.find().sort({ _id:-1 }).limit(5) 
            : await User.find()
        res.status(200).json(users)
    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = router