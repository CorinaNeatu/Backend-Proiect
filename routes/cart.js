const Cart = require("../models/Cart");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");

const router = require("express").Router();


//&GET USER CART
//ne asiguram ca userul isi vede cosul sau, si nu al altui utilizator
//vizualizare cos
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart =  await  Cart.findOne({userId: req.params.userId})
        res.status(200).json(cart)
    } catch(err) {
        res.status(500).json(err)
    }
})


//&GET ALL CARTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts)
    } catch(err) {
        res.status(500).json(err)
    }
})


//*CREATE
//pentru crearea unui cos, userul trebuie sa fie autentificat
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    } catch(err) {
        res.status(500).json(err)
    }
})


//^UPDATE
//pentru adaugarea in cos, verificam daca id-ul userului care face requestul, este fk-ul cosului in care se adauga
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        console.log("Req.params.id", req.params.id);
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            //update the cart
            $set: req.body
            //return the updated cart
        }, {new: true})
        res.status(200).json(updatedCart)
    }
    catch(err) {
        res.status(500).json(err);
    }
})


//!DELETE
//cand se sterge un user, i se sterge automat si cosul din baza de date, un user poate fi sters decat de catre admin, punem aceeasi conditie si la stergerea cosului
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted...")
    } catch(err) {
        res.status(500).json(err)
    }
})




module.exports = router