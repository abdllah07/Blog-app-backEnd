import express  from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import path from "path"
// routes 
import userRoutes from './routes/UserRoutes'
import postRoutes from './routes/PostRoutes'
import commentRoute from './routes/CommentRoute'

import { errorResponseHandler, invalidPathHandler } from "./middleware/errorHandler";

dotenv.config();
connectDB()
const app = express();
app.use(express.json());

app.get('/' , (req, res) => {
    res.send("server is running")
});

app.use('/api/users' , userRoutes)
app.use('/api/posts' , postRoutes)
app.use('/api/comments' , commentRoute)

// static assets 
app.use('/uploads/', express.static(path.join(__dirname, '/uploads')));

app.use(invalidPathHandler);
app.use(errorResponseHandler);

const PORT = process.env.PORT || 5000 ; 


app.listen(PORT , ()=> console.log(`server is running on port ${PORT}`)); 