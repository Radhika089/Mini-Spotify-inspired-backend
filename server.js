import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { dbConnect } from "./config/db.js";
import musicRouter from "./routes/music.routes.js";

dbConnect();
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/music", musicRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
