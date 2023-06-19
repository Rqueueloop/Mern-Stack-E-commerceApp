import Express from "express";

import dotenv from "dotenv";

import morgan from "morgan";

import ConnectDB from "./config/db.js";

import cors from "cors";

import AuthRoutes from "./routes/authRoutes.js";

import CategoryRoutes from "./routes/CategoryRoutes.js";

import ProductRoutes from "./routes/ProductRoutes.js";

// import path from "path";

//CONFIG ENV

dotenv.config();

// CONFIG DATABASE

ConnectDB();

const app = Express();

//MIDDELWARES
app.use(cors());
app.use(Express.json());
app.use(morgan("dev"));
// app.use(Express.static(path.join(__dirname, "./client/build")));

// --- ROUTES ---
app.use(AuthRoutes);
app.use(CategoryRoutes);
app.use(ProductRoutes);

// //API
// app.use("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

//PORT
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
