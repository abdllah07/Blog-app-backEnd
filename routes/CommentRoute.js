import express from "express";
import { adminGuard, authGuard } from "../middleware/authMiddleware";
import { createComment, deleteComment, updateComment } from "../controllers/CommentControllers";


const router = express.Router();

router.post('/', authGuard ,createComment);
router.route('/:commentId').put( authGuard ,updateComment).delete( authGuard ,deleteComment );

export default router;