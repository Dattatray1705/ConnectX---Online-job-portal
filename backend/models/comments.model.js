// external user can enter data like comments.
import mongoose from "mongoose";


const CommentSchema = new mongoose.Schema({
    userId:{                                       // who made the comment
        type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    postId:{                                        // on which post the comment is made
        type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
    },
    body:{                                          // comment content
        type: String,
        required: true
    },

});
const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;