/** @format */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ejs from "ejs";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");

app.get("/", say_hello);

app.post("/api/download", getContent);

app.listen(PORT, () =>
  console.log(`server started on http://localhost:${PORT}`)
);
