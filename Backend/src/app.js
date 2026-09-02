import express from "express";


import authRoutes from "./routes/authRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

import {errorHandler}from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import cors from "cors";






import morgan from "morgan";
import helmet from "helmet";



const app = express();

app.use(helmet());

app.use(express.json());
app.use(morgan("dev"));





app.use(apiLimiter);


app.use(
    cors({
        origin: "http://localhost:5173"
    })
);



app.use("/api/auth", authRoutes);






app.use("/api/github",githubRoutes);







app.use("/api/favorites",favoriteRoutes);










app.use(errorHandler);




export default app;