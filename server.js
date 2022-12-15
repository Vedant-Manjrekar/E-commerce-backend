import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Users from "./models/users.js";
import bcrypt from "bcryptjs";
const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

// * Middlewares
app.use(express.json());
app.use(
  cors({
    // origin: "https://e-commerce-store-delta.vercel.app",
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
  })
);

const connectURL = process.env.DATABASE_URL;

mongoose.connect(connectURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

app.post("/addToCart", async (req, res) => {
  const { email, order } = req.body;

  const userdata = await Users.findOne({ email });

  const newOrder = [...userdata.order, order];

  console.log(userdata);

  Users.findByIdAndUpdate(
    userdata._id,
    { order: newOrder },
    { new: true },
    (err, data) => {
      err ? res.send(err) : res.send(data);
    }
  );
});

app.post("/final_order", async (req, res) => {
  const { email } = req.body;

  const userdata = await Users.findOne({ email });

  res.send(userdata);
});

app.post("/unique", (req, res) => {
  const { email, order } = req.body;
  Users.findOneAndUpdate({ email }, { order }, { new: true }, (err, data) => {
    err ? res.send(err) : res.send(data);
  });
});

app.post("/increaseQuantity", async (req, res) => {
  const { email, order } = req.body;

  Users.findOneAndUpdate({ email }, { order }, { new: true }, (err, data) => {
    err ? res.send(err) : res.send(data);
  });
});

app.post("/removeFromCart", async (req, res) => {
  const { email, order } = req.body;

  Users.findOneAndUpdate({ email }, { order }, { new: true }, (err, data) => {
    err ? res.send(err) : res.send(data);
  });
});

app.post("/checkout", async (req, res) => {
  const { email, order, final_order, address } = req.body;

  const user = await Users.findOne({ email });

  console.log(user);

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

app.post("/signup", async (req, res) => {
  // * getting data from the api input and destructuring it.
  const { email, password, name, phone } = req.body;

  const doesExists = await Users.findOne({ email });

  if (doesExists) {
    res.status(400).send("Email already in use.");
  } else {
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userEmail = await Users.findOne({ email });

  if (userEmail) {
    const isUser = await bcrypt.compare(password, userEmail.password);
    if (isUser == true) {
      res.status(200).send(userEmail);
    } else {
      res.status(404).send("Incorrect email or password");
    }
  } else {
    res.send("User not found");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
