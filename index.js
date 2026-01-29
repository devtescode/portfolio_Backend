// const express = require('express')
// const app = express()
// const mongoose = require('mongoose')
// const env = require ('dotenv').config()
// const PORT = process.env.PORT || 4000
// const URI = process.env.URI
// const userRoutes = require("./Routes/user.routes")
// const uploadRoute = require("./Controllers/user.upload")
// const cors = require('cors')
// app.use(cors())
// app.use(express.urlencoded({ extended:true, limit:"200mb"}))
// app.use(express.json({limit:"200mb"}))


// mongoose.connect(URI)
// .then(()=>{
//     console.log("Datebase connect succcessfully");
// }).catch((err)=>{
//     console.log(err);
// })
// app.use("/portfolio", userRoutes)
// app.use(userRoutes)


// app.use('/api', uploadRoute)

// app.get("", (req,res)=>{
//     res.status(200).json({message:"Welcome to Portfolio"})
// })

// app.listen(PORT, ()=>{  
//     console.log("Server is running on port 4000");
// })

const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 4000;
const URI = process.env.URI;

const userRoutes = require("./Routes/user.routes");
const uploadRoute = require("./Controllers/user.upload");

/* =======================
   CORS CONFIG (IMPORTANT)
======================= */
app.use(
  cors({
    origin: [
      "https://tescodeportfolio.vercel.app",
      "http://localhost:5173",
      "http://localhost:8080",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

/* =======================
   BODY PARSERS
======================= */
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(express.json({ limit: "200mb" }));

/* =======================
   DATABASE
======================= */
mongoose
  .connect(URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error(err));

/* =======================
   ROUTES
======================= */
app.use("/portfolio", userRoutes);
app.use("/api", uploadRoute);

/* =======================
   ROOT
======================= */
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Portfolio" });
});

/* =======================
   SERVER
======================= */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
