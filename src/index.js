import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db/index.js';
import { app } from './app.js';


connectDB().then(()=>{

    // console.log("here"),
    // console.log(app),
    app.on('error',(error)=>{console.log(error)})
    app.listen(process.env.PORT || 8000,()=>{console.log("server running")})
}
).catch(error=>{console.log("error in .then.catch, ",error)})
;
