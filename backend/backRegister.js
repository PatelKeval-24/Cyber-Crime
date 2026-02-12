import express from 'express';
var app = express();
import cors from 'cors';

import { connectDB, getDB } from './db.js';
connectDB();


app.use(cors({
    origin: 'http://localhost:5173',
   
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const PORT = 3000;

app.post('/register', async (req,res)=>{
    const {name,email,contectNumber,address,password} = req.body;
    res.send('User Register Successfully');
    const db = getDB();
    const collection = db.collection('volunteer');
    const result = await collection.insertOne({name,email,contectNumber,address,password})
    console.log("Insertion result:", result);
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

