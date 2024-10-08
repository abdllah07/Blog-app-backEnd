import { populate } from "dotenv";
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
        const {desc, check} = req.body;
        
        const comment = await Comment.findById(req.params.commentId);

        if(!comment) {
            const error = new Error("comment not found");
            return next(error);
        }

        comment.desc = desc || comment.desc;
        comment.check = typeof check !== "undefined" ? check : comment.check;
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



const getAllComments = async (req, res , next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if(filter){
            where.desc = {$regex: filter ,$options : 'i'};
        }
        let query = Comment.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await Comment.find(where).countDocuments();
        const pages = Math.ceil(total / pageSize);

        res.header({
            'x-filter' : filter,
            'x-totalCount' : JSON.stringify(total),
            'x-currentPage' : JSON.stringify(page),
            'x-pageSize' : JSON.stringify(pageSize),
            'x-totalPageCount' : JSON.stringify(pages),
        })


        if(page > pages ) {
            return res.json([]);
        }
        const result =  await query.skip(skip).limit(pageSize).populate([
            {
                path: "user",
                select: ['avatar', 'name' ,'verified'],
            },
            {
                path: "parent",
                populate : {
                    path: "user",
                    select: ['avatar', 'name' ],
                }
            },
            {
                path: "replayOnUser",
                select: ['avatar', 'name'],
            },
            {
                path: "post",
                select : ['slug' , "title"],
            }
        ]).sort({updatedAt : "desc"});
        
        return res.json(result);

    } catch (error) {
        next(error);
    }
}

export { createComment , updateComment , deleteComment , getAllComments}