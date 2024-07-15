import express from 'express'
import path from 'path'
const app = express();

app.get('/',(req,res)=>{
    console.log("hello world")
    res.json("hello world")
})


export {app}