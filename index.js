//initializam aplicatia express, care este serverul de backend
const express = require('express');
const app = express();

//importam mongoose, package care ne ajuta sa ne contectam la baza de date
const mongoose = require('mongoose');

//importam dotenv, librarie ce ne va permite sa accesam variabilele private din fisierul .env
const dotenv = require('dotenv');
dotenv.config();


//importam cors(cross origin resource sharing) si il initializam
const cors = require("cors");
app.use(cors());


//fara functia aceasta nu am putea face requesturi de post sau put, deoarece serverul trebuie sa primeasca datele in format json
app.use(express.json())

//importam rutele definite in folderul routes
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');


//legam middlewareurile de serverul nostru, practic daca nu am definini aceste middlewareuri nu am putea accesa endpointurile, construire api
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);


//ne conectam la baza de date mongodb
mongoose.connect("mongodb+srv://vladparlici:psic69@ecommerceproject.ypllwzg.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connection to database successful"))
    .catch((err) => console.log(err));


//pornim serverul pe portul 5000
app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server running");
});