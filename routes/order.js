const Order = require("../models/Order");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");

const router = require("express").Router();

//*CREATE
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    } catch(err) {
        res.status(500).json(err)
    }
})


//^UPDATE
router.put("/:id", verifyTokenAndAuthorization,  async (req, res) => {
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            //update the Order
            $set: req.body
            //we need to use new in order for the updated Order to be returned
        }, {new: true})
        res.status(200).json(updatedOrder)
    }
    catch(err) {
        res.status(500).json(err);
    }
})


//!DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted...")
    } catch(err) {
        res.status(500).json(err)
    }
})


//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order =  await  Order.find({userId: req.params.userId})
        res.status(200).json(order)
    } catch(err) {
        res.status(500).json(err)
    }
})

//GET ORDER BY ID
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order =  await  Order.findById(req.params.id)
        res.status(200).json(order)
    } catch(err) {
        res.status(500).json(err)
    }
})

//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders)
    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = router