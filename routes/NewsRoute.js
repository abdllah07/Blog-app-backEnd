import express from "express";
import { adminGuard, authGuard } from "../middleware/authMiddleware";
import   {createNews, deleteNews, getAllNews, getNews, updateNews }  from "../controllers/NewsController";





const router = express.Router();

router.route("/").post(authGuard , adminGuard , createNews).get(getAllNews)
router.route("/:slug").put(authGuard , adminGuard , updateNews).delete(  authGuard , adminGuard, deleteNews).get(getNews)

export default router;
