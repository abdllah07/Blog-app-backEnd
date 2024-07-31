import express  from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

// routes 
import userRoutes from './routes/UserRoutes'
import { errorResponseHandler, invalidPathHandler } from "./middleware/errorHandler";

dotenv.config();
connectDB()
const app = express();
app.use(express.json());

app.get('/' , (req, res) => {
    res.send("server is running")
});

app.use('/api/users' , userRoutes)
app.use(invalidPathHandler);
app.use(errorResponseHandler);

const PORT = process.env.PORT || 5000 ; 


app.listen(PORT , ()=> console.log(`server is running on port ${PORT}`)); 