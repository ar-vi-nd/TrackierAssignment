import express from 'express'
import path from 'path'
const app = express();
import userRouter from './route/user.route.js';

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended : true,limit:"16kb"}))
app.use(express.static(path.resolve('./public')))

app.use('/api/v1/users',userRouter)


export {app}