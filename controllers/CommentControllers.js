import Comment from "../models/Comment";
import Post from "../models/Post";

const  createComment = async(req , res , next) => {
    try {
        const { desc , slug , parent  , replayOnUser} = req.body;

        const post = await Post.findOne({ slug : slug});

        if(!post) {
            const error = new Error("post not found");
            return next(error);
        }
        const newComment = new Comment ({
            user : req.user._id,
            desc,
            post : post._id,
            parent,
            replayOnUser ,
        });
        const savedComment = await newComment.save(newComment);
        return res.json(savedComment);

    } catch (error) {
        next(error);
    }
}

const  updateComment = async(req , res , next) => {
    try {
        const {desc} = req.body;

        const comment = await Comment.findById(req.params.commentId);

        if(!comment) {
            const error = new Error("comment not found");
            return next(error);
        }

        comment.desc = desc || comment.desc;k
        const updatedComment = await comment.save(comment);
        return res.json(updatedComment);


    } catch (error) {
        next(error);
    }
}

const  deleteComment = async(req , res , next) => {
    try {

        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        await Comment.deleteMany({parent : comment._id}) // to delete the reply comments 

        if(!comment) {
            const error = new Error("comment was not found");
            return next(error);
        }
        return res.json({
            message : "comment deleted successfully",
        });


    } catch (error) {
        next(error);
    }
}


export { createComment , updateComment , deleteComment}