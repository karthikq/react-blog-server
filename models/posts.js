/** @format */

import mongoose from "mongoose";

const PostsSchema = mongoose.Schema({
  fieldName: String,
  usersPost: [
    {
      title: String,
      post_Id: String,
      fieldName: String,
      description: String,
      like: {
        type: Number,
        default: 1,
      },
      dislike: {
        type: Number,
        default: 1,
      },
      image: String,
      userId: String,
      date: String,
      profileUrl: String,
      userDetails: {},
    },
  ],
});

const Post = mongoose.model("Post", PostsSchema);
export default Post;
