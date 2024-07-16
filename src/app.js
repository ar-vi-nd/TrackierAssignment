import express from 'express'
import path from 'path'
const app = express();
import userRouter from './route/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { verifyjwt } from './middleware/auth.middleware.js';
import projectRouter from './route/project.route.js';
import taskRouter from './route/task.route.js';

app.use(cors({
    origin : process.env.CORS_ORIGIN
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended : true,limit:"16kb"}))
app.use(cookieParser())
app.use(express.static(path.resolve('./public')))

app.use('/api/v1/users',userRouter)
app.use('/api/v1/projects',verifyjwt,projectRouter)
app.use('/api/v1/tasks',verifyjwt,taskRouter)


export {app}