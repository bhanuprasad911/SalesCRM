import express from 'express';
import dotenv from 'dotenv';
import dbConnection from './config/dbConnection.js';
import path from 'path'
dotenv.config();
const app = express();
const port = process.env.PORT;
const url = process.env.MONGO_URL;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use('/admin', express.static(path.join(__dirname,  '../frontend-admin/dist')));
app.use('/ex', express.static(path.join(__dirname, '../frontend-client/dist')))

app.get('/admin/*path', (req,res,next)=>{
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, '../frontend-admin/dist/assets/index.html'))
    }
    else{
        next()
    }
})

app.get('/ex/*path', (req,res,next)=>{
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, '../frontend-client/dist/assets/index.html'))
    }
})







app.listen(port, '0.0.0.0', ()=>{
    console.log(`server started at http://localhost:${port}`)
    dbConnection(url)
})

