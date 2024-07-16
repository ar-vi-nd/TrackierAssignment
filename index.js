import dotenv from 'dotenv';
dotenv.config();

import connectDB from './src/db/index.js';
import { app } from './src/app.js';


connectDB().then(()=>{

    // console.log("here"),
    // console.log(app),
    app.on('error',(error)=>{console.log(error)})
    app.listen(process.env.PORT || 8000,()=>{console.log("server running")})
}
).catch(error=>{console.log("error in .then.catch, ",error)})
;
