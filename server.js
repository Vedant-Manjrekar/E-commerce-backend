import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import Users from "./models/users.js";
import bcrypt from "bcryptjs";
const app = express();
const port = process.env.PORT || 3000;

// * Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "https://e-commerce-store-delta.vercel.app",
    // origin: "*",
    credentials: true, //access-control-allow-credentials:true
  })
);

console.log(process.env.DATABASE_URL);

mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;

// // what database to do when faced with an error.
db.on("error", (error) => {
  console.error(error);
});

// // what database to do once started.
db.once("open", () => {
  console.log("Connected to Database Successfully 🚀");
});

// // Routing
app.post("/order", async (req, res) => {
  const { email } = req.body;
  try {
    const userData = await Users.findOne({ email });

    res.send(userData);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

// add to cart
app.post("/addToCart", async (req, res) => {
  // fetchs email and order from request body.
  const { email, order } = req.body;

  // finds that user based on its email.
  const userdata = await Users.findOne({ email });

  // preparing new order comining previous and new data.
  const newOrder = [...userdata.order, order];

  // updates database.
  Users.findByIdAndUpdate(
    userdata._id,
    { order: newOrder },
    { new: true },
    (err, data) => {
      err ? res.send(err) : res.send(data);
    }
  );
});

// unique array (with no duplicates.)
app.post("/unique", (req, res) => {
  // fetchs data
  const { email, order } = req.body;

  // updates database.
  Users.findOneAndUpdate({ email }, { order }, { new: true }, (err, data) => {
    err ? res.send(err) : res.send(data);
  });
});

// increase cart item quantity.
app.post("/increaseQuantity", async (req, res) => {
  // fetchs data
  const { email, order } = req.body;

  // updates database.
  Users.findOneAndUpdate({ email }, { order }, { new: true }, (err, data) => {
    err ? res.send(err) : res.send(data);
  });
});

// Remove item from cart
app.post("/removeFromCart", async (req, res) => {
  // fetchs data
  const { email, order } = req.body;

  // updates database.
  Users.findOneAndUpdate({ email }, { order }, { new: true }, (err, data) => {
    err ? res.send(err) : res.send(data);
  });
});

// checkout (place order)
app.post("/checkout", async (req, res) => {
  // fetchs data
  const { email, order, final_order, address } = req.body;

  // finds user
  const user = await Users.findOne({ email });

  // update database with new order.
  Users.findByIdAndUpdate(
    user._id,
    { address, order, final_order },
    { new: true },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.send(data);
      }
    }
  );
});

// signup
app.post("/signup", async (req, res) => {
  // * getting data from the api input and destructuring it.
  const { email, password, name, phone } = req.body;

  // searching user.
  const doesExists = await Users.findOne({ email });

  // if found, throw error.
  if (doesExists) {
    res.status(400).send("Email already in use.");
  }
  // else hash the password and save user.
  else {
    const hash = await bcrypt.hash(password, 10);

    Users.create({ name, email, password: hash, phone }, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  }
});

// login
app.post("/login", async (req, res) => {
  // fetchs data
  const { email, password } = req.body;

  // search's user
  const userEmail = await Users.findOne({ email });

  // if found, checks for password match.
  if (userEmail) {
    const isUser = await bcrypt.compare(password, userEmail.password);

    // if matched sends user data.
    if (isUser == true) {
      res.send(userEmail);
    }
    // else throws error.
    else {
      res.status(404).send("Incorrect email or password");
    }
  }
  // if not found throws error
  else {
    res.status(404).send("User not found");
  }
});

// listining to port.
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
