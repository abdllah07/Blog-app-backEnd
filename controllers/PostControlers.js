import { populate } from "dotenv";
import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Comment from "../models/Comment";
import Post from "../models/Post";
import { fileRemover } from "../utils/fileRemover";
import { v4 as uuidv4 } from 'uuid';

const  createPost = async(req , res , next) => {
    try {
        const post = new Post({
            title: "This is a post title ",
            caption:"this is a post caption and caption is optional and optional caption is optional and optional caption is optional",
            slug: uuidv4(),
            body: { 
                type : "doc",
                content : [],
            },
            photo:  "",
            user: req.user._id, 
        });

        const createdPost = await post.save();
        return res.json(createdPost);
    } catch (error) {
        next(error);
    }
}

const  updatePost = async(req , res , next) => {
    try {
        const post =  await Post.findOne({slug: req.params.slug});
        
        if(!post) {
            const error = new Error("Post not found")
            next(error)
            return;
        }


        const upload = uploadPicture.single('postPicture');

        const handleUpdatePostData = async (data) => {
            const {title , caption , slug , body , tags , categories } = JSON.parse(data);
            post.title = title || post.title ;
            post.caption = caption || post.caption ;
            post.slug = slug || post.slug ;
            post.body = body || post.body ;
            post.tags = tags || post.tags ;
            post.categories = categories || post.categories ;
            const updatedPost = await post.save();
            return res.json(updatedPost)
        }
        
        upload(req , res , async function (err){
            if(err) {
                const error = new Error("n unknown error occurred while uploading profile picture")
                next(error);
            }else {
                // everything went will 
                let filename; 
                if(req.file) {
                    filename = post.photo;
                    if(filename) {
                        fileRemover(filename);
                    }
                    post.photo = req.file.filename;
                    handleUpdatePostData(req.body.document)
                }else {
                    let filename; 
                    filename = post.photo;
                    post.photo = "";
                    fileRemover(filename);
                    handleUpdatePostData(req.body.document)

                }

            }
        })



    } catch (error) {
        next(error);
    }
}



const deletePost = async (req, res , next) => {

    try {
        const post = await Post.findOneAndDelete({slug: req.params.slug});

        if(!post) {
            const error = new Error("Post not found")
            return next(error);
        }

            await Comment.deleteMany({post : post._id});

        return res.json({
            message : "Post deleted successfully",
        })

    } catch (error) {
        next(error);
    }

}

const getPost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).populate([
            // get the user data 
            {
                path: "user",
                select: ['avatar', 'name'],
            },
            // get the comments data
            {
                path: "comments",
                match: {
                    check: true,
                    parent: null,
                },
                // get the child comments 
                populate: [
                    {
                        path: "user",
                        select: ['avatar', 'name'],
                    },
                    {
                        path: "replies",
                        match: {
                            check: true,
                        },
                        populate: {
                            path: "user",
                            select: ['avatar', 'name'],
                        },
                    },
                ],
            },
        ]);

        if (!post) {
            const error = new Error("Post not found");
            error.status = 404;
            return next(error);
        }

        return res.json(post);
    } catch (error) {
        next(error);
    }
};



const getAllPost = async (req , res , next) => {
    try {
        const posts = await Post.find({}).populate([
            // get the user data 
            {
                path : "user",
                select : ['avatar' , "name" , "verified"],
            },
        ]);
        res.json(posts);
        
    } catch (error) {
        next(error);
    }
}



export { createPost , updatePost  , deletePost , getPost , getAllPost}