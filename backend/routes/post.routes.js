import { Router } from "express";
import { activeCheak ,createPost, getAllPosts,deletePost,get_comment_by_post ,delete_comment_of_user,increment_like,commentPost,} from "../controllers/post.controller.js";
import multer from "multer";
const router = Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, "uploads/");
  },
  filename:(req, file, cb)=> {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

router.route("/").get(activeCheak);
router.post("/post",upload.single('media'),createPost);
router.get("/posts", getAllPosts);
router.post("/create_post", upload.single("media"), createPost);
router.delete("/delete_post",deletePost);
router.post("/user/comment_post", commentPost);
router.get("/get_comment_by_post", get_comment_by_post);
router.delete("/delete_comment_of_user", delete_comment_of_user);
router.post("/increment_post_like",increment_like)
export default router;