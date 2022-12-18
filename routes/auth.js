const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

//register
router.post("/register", async (req, res) => {
    //cream un nou user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString()
    });

    //folsim blocul try catch
    try {
        //folosim await pentru ca actiunea de save este asincrona
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch(err) {
        res.status(500).json(err)
    }
});

//login
router.post("/login", async (req, res) => {
    try {
        //*verificam daca exista usernameul in baza de date
        const user = await User.findOne({username: req.body.username})
        !user && res.status(401).json({message: "Username not registered"})
        
        //*descriptam parola din baza de date corespunzatoare userului gasit mai devreme si verificam daca corespunde cu cea introdusa de utilizator in formularul de login
        const passwordOriginal = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET).toString(CryptoJS.enc.Utf8)
        passwordOriginal !== req.body.password && res.status(401).json({message: "Wrong password for current username"})

        //&contruim access token, unde trimitem id-ul userului si booleanul isAdmin
        const accessToken = jwt.sign({
            id: user._id, 
            isAdmin: user.isAdmin,
        }, process.env.JWT_SECRET, {expiresIn: "3d"})

        //&pe frontend o sa stocam datele unui user in local storage, asa ca separam parola de restul proprietatilor, deoarece nu dorim sa o stocam in local storage
        const {password, ...others} = user._doc;

        //&trimitem ca raspuns datele userului mai putin parola + accessToken pe care il vom folosi pentru autorizare
        res.status(200).json({...others, accessToken})
    } catch(err) {
        res.status(500).json(err)
    }
});

module.exports = router