const jwt = require("jsonwebtoken");  //importam jwt
const Cart = require("../models/Cart");
const Order = require("../models/Order");
//* cu functia verifyToken, aflam practic daca un utilizator este autentificat fiindca doar utilizatorii autentificati au token jwt
const verifyToken = (req, res, next) => {
    //din frontend se primeste o proprietate din obiectul de headers cu numele authorization, verificam daca aceasta exista
    const authHeader = req.headers.authorization
    console.log("on verify token###########", authHeader);
    if(authHeader) {
        //este de forma "Bearer dsahfph4124.....", folosim functia de split si luam secventa de caractere prezenta dupa Bearer
        const token = authHeader.split(" ")[1];

        //verificam daca criptarea jwt_secret exista in token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) {
                return res.status(403).json("Invalid token")
            }
            console.log("user is", user)
            //user este de fapt obiectul token pe care l-am construit in functia de login din auth.js 
            req.user = user

            //functia de next() practic ne intoarce in endpointul unde apelata ca middleware, ca sa se continue executarea functiei in cazul in care totul este ok, altfel intoarce eroare
            next();
        })
    } else {
        return res.status(401).json("You are not authenticated")
    }
}

//* verificam daca userul care face request ul este autorizat sa acceseze un anume enpoint
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, async () => {
        console.log("coming on##################", req.params);
        let cart = null
        let order = null
        if(req.params) {
            cart =  await Cart.findById(req.params.id)
            order = await Order.findById(req.params.id)
        }
        console.log("req.params", req.params)
        console.log("req.user.id", req.user);
        let found 
        if(cart) {
            found = cart.userId
        } else if(req.params.userId) {
            found = req.params.userId
        } else if(order) {
            found = order.userId
        } else if(req.params.id) {
            found = req.params.id
        }
        console.log("found is", found);
        console.log("user id is", req.user.id)
        if(req.user.id === found || req.user.isAdmin) {
            console.log("################################");
            next()
        } else {
            res.status(403).json("You can't do that")
        }
    })
}


//*verificam daca userul care face requestul este admin
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("You can't do that")
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}