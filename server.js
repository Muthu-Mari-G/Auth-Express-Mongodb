// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import cards from "./routes/cards.js";

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use("/uploads", express.static("uploads"));

// app.use(express.urlencoded({ extended: true}));
// app.use(cards);

// const uri = process.env.MONGODB_URI;

// mongoose
// .connect(uri)
// .then(()=>{console.log("mongoDB Connected")})
// .catch((error) => {
//     console.log("MongoDB connection error", error)
// })

// const PORT = process.env.PORT || 3001;

// app.listen(PORT,()=> {
//     console.log(`server running on http://localhost:${PORT}`)
// })



import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import users from "./routes/users.js";

dotenv.config();

const app = express();

// For __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Static folder to serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use the students routes
app.use(users);

// Connect to MongoDB without deprecated options
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
