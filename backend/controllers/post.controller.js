import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";

/* ================= ACTIVE CHECK ================= */
export const activeCheak = (req, res) => {
  return res.status(200).json({ message: "route is active" });
};

/* ================= CREATE POST ================= */
export const createPost = async (req, res) => {
  try {
    // ✅ TOKEN FROM HEADER
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file ? req.file.filename : "",
    });

    await post.save();
    return res.status(201).json({ message: "Post created successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL POSTS ================= */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name username email profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts); // ✅ array directly
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE POST ================= */
export const deletePost = async (req, res) => {
  try {
    const { token, post_id } = req.body;

    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: post_id });
    return res.status(200).json({ message: "Post deleted" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET COMMENTS BY POST ================= */
export const get_comment_by_post = async (req, res) => {
  try {
    const { post_id } = req.query;

    const comments = await Comment.find({ postId: post_id })
      .populate("userId", "name username ");

    return res.status(200).json(comments);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE COMMENT ================= */
export const delete_comment_of_user = async (req, res) => {
  try {
    const { token, comment_id } = req.body;

    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Comment.deleteOne({ _id: comment_id });
    return res.status(200).json({ message: "Comment deleted" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= LIKE POST ================= */
export const increment_like = async (req, res) => {
  try {
    const { post_id } = req.body;

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes = (post.likes || 0) + 1;
    await post.save();

    return res.status(200).json({ message: "Like incremented" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= COMMENT ON POST ================= */
export const commentPost = async (req, res) => {
  try {
    const { token, post_id, commentBody } = req.body;

    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      body: commentBody,
    });

    await comment.save();
    return res.status(200).json({ message: "Comment added" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
