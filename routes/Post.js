/** @format */

import express from "express";
import Post from "../models/posts.js";
import mommnet from "moment";
import { nanoid } from "nanoid";
import Authmiddleware from "../middleware/Authmiddleware.js";
import User from "../models/users.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("server is running");
});

router.post("/data/post", Authmiddleware, async (req, res) => {
  const date = mommnet().format("MMMM Do YYYY h:mm:ss a");
  const post_Id = nanoid();

  if (req.user) {
    try {
      const checkFieldName = await Post.findOne({
        fieldName: req.body.fieldName,
      });
      console.log("====================================");
      console.log(req.body);
      console.log("====================================");
      req.body.userId = req.user.userId;
      req.body.post_Id = post_Id;
      req.body.like = 0;
      req.body.dislike = 0;
      req.body.sortDate = new Date();
      if (checkFieldName) {
        await Post.findOneAndUpdate(
          { fieldName: req.body.fieldName },
          { $push: { usersPost: req.body } },
          { new: true }
        );
        // const userPostdetails = { post_Id };

        res.status(200).json(req.body);
      } else {
        const post = new Post({
          fieldName: req.body.fieldName,
          usersPost: req.body,
        });
        await post.save();
        res.status(200).json(req.body);
      }
      await User.findOneAndUpdate(
        { userId: req.user.userId },
        {
          $push: {
            posts: { post_Id, fieldName: req.body.fieldName },
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("err");
  }
});

router.get("/user/posts", async (req, res) => {
  const posts = await Post.find({});
  res.json(posts);
});

router.get("/post/user/:id", async (req, res) => {
  const userId = req.params.id;
  const userDetails = await User.findOne({ userId });
  if (userDetails) {
    res.json(userDetails);
  } else {
    res.json("no user found");
  }
});
router.patch("/post/like", async (req, res) => {
  const { userId, _id, post_Id, fieldName, loggedInuserId } = req.body;

  const checkPost = await Post.findOne({
    fieldName,
  });

  const elem = checkPost.usersPost.find((el) => el.post_Id === post_Id);

  const updateLikes = await User.findOneAndUpdate(
    { userId: loggedInuserId },
    {
      $push: { likes: { user: loggedInuserId, postuserId: userId, post_Id } },
    },
    { new: true }
  );
  await Post.findOneAndUpdate(
    { fieldName, "usersPost.post_Id": post_Id },
    {
      $set: { "usersPost.$.like": elem.like + 1 },
    },
    {
      new: true,
    }
  );
  const elem2 = checkPost.usersPost.find((el) => el.post_Id === post_Id);

  res.json({ elem2, updateLikes });
});

router.patch("/post/unlike/:id", async (req, res) => {
  const { userId, _id, post_Id, fieldName, loggedInuserId } = req.body;

  const checkPost = await Post.findOne({
    fieldName,
  });

  //finding userspost with post_Id
  const elem = checkPost.usersPost.find((el) => el.post_Id === post_Id);

  const removeuserLikes = await User.findOneAndUpdate(
    { userId: loggedInuserId },
    {
      $pull: { likes: { post_Id: post_Id } },
    },
    { new: true }
  );

  const removeLikes = await Post.findOneAndUpdate(
    { fieldName, "usersPost.post_Id": post_Id },
    {
      $set: { "usersPost.$.like": elem.like - 1 },
    },
    {
      new: true,
    }
  );
  const elem2 = removeLikes.usersPost.find((el) => el.post_Id === post_Id);

  res.json({ elem2, removeuserLikes });
});

router.patch("/post/dislike/:id", async (req, res) => {
  const { userId, _id, post_Id, fieldName, loggedInuserId } = req.body;
  console.log(userId);
  const checkPost = await Post.findOne({
    fieldName,
  });
  const elem = checkPost.usersPost.find((el) => el.post_Id === post_Id);

  const updateUserdiskes = await User.findOneAndUpdate(
    { userId: loggedInuserId },
    {
      $push: {
        dislikes: { user: loggedInuserId, postuserId: userId, post_Id },
      },
    },
    { new: true }
  );
  const updatepostDislike = await Post.findOneAndUpdate(
    { fieldName, "usersPost.post_Id": post_Id },
    {
      $set: { "usersPost.$.dislike": elem.dislike + 1 },
    },
    {
      new: true,
    }
  );
  const elem2 = updatepostDislike.usersPost.find(
    (el) => el.post_Id === post_Id
  );
  res.json({ elem2, userData: updateUserdiskes });
});

router.patch("/post/undislike/:id", async (req, res) => {
  const { userId, _id, post_Id, fieldName, loggedInuserId } = req.body;
  console.log(userId);
  const checkPost = await Post.findOne({
    fieldName,
  });

  //finding userspost with post_Id
  const elem = checkPost.usersPost.find((el) => el.post_Id === post_Id);

  const removeuserdisLikes = await User.findOneAndUpdate(
    { userId: loggedInuserId },
    {
      $pull: { dislikes: { post_Id: post_Id } },
    },
    { new: true }
  );

  const removedisLikes = await Post.findOneAndUpdate(
    { fieldName, "usersPost.post_Id": post_Id },
    {
      $set: { "usersPost.$.dislike": elem.dislike - 1 },
    },
    {
      new: true,
    }
  );
  const elem2 = removedisLikes.usersPost.find((el) => el.post_Id === post_Id);

  res.json({ elem2, removeuserdisLikes });
});

router.delete("/post/delete/:id", async (req, res) => {
  const postid = req.params.id;
  const { fieldName } = req.body;

  const deletePost = await Post.findOneAndUpdate(
    { fieldName: fieldName },
    { $pull: { usersPost: { post_Id: postid } } },
    { new: true }
  );
  if (deletePost.usersPost.length > 0) {
    res.json({ deletePost });
  } else {
    await Post.findOneAndDelete({ fieldName: fieldName }, { new: true });
    const posts = await Post.find({});
    res.json({ deletePost, posts });
  }
});
router.patch("/post/addfav/:id", async (req, res) => {
  const { post_Id, fieldName, userId, loggedInuserId } = req.body;
  const favData = {
    user: loggedInuserId,
    postUserId: userId,
    fav_postId: post_Id,
  };
  const addFav = await User.findOneAndUpdate(
    { userId: loggedInuserId },
    {
      $push: { fav: favData },
    },
    {
      new: true,
    }
  );
  res.json(addFav);
});
router.patch("/post/removefav/:id", async (req, res) => {
  const { post_Id, fieldName, userId, loggedInuserId } = req.body;

  const removeFav = await User.findOneAndUpdate(
    { userId: loggedInuserId },
    {
      $pull: { fav: { fav_postId: post_Id } },
    },
    {
      new: true,
    }
  );
  res.json(removeFav);
});
router.get(`/user/post/data/:id`, async (req, res) => {
  const id = req.params.id;
  const fieldName = req.query.fieldName;
  const posts = await Post.findOne({ "usersPost.post_Id": id });
  const d = posts.usersPost.filter((item) => item.post_Id === id);

  res.json(d);
});
export default router;
