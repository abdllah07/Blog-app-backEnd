import express from "express";
import {  authGuard } from "../middleware/authMiddleware";
import { createUserArticle, deleteUserArticle, getAllUserArticle, getUserArticle, updateUserArticle } from "../controllers/UserArticleController";





const router = express.Router();

router.route("/").post(authGuard  , createUserArticle).get(getAllUserArticle)
router.route("/:slug").put(authGuard  , updateUserArticle).delete(  authGuard , deleteUserArticle).get(getUserArticle)

export default router;
