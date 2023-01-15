/** @format */

import mongoose from "mongoose";

const PostsSchema = mongoose.Schema(
  {
    username: String,
    googleId: String,
    githubId: String,
    email: String,
    password: String,
    date: String,
    userId: String,
    posts: [],
    likes: [],
    dislikes: [],
    fav: [],
    profileUrl: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", PostsSchema);
export default User;
