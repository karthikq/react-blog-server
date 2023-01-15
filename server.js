/** @format */
import dotenv from "dotenv";
dotenv.config();
import express from "express";

import session from "express-session";
import cors from "cors";

import postRoute from "./routes/Post.js";
import userRoute from "./routes/User.js";
import authRoute from "./routes/Auth.js";
import connection from "./connection/mongo.js";
import passport from "passport";
import GoogleAuth from "./Auth/GoogleAuth.js";

import GithubLogin from "./Auth/GithubAuth.js";
const port = process.env.PORT || 4000;

const app = express();
GoogleAuth(passport);
GithubLogin(passport);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "key_value",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

connection();

app.use("/", postRoute);
app.use("/user", userRoute);
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log("server is running in port " + port);
});
