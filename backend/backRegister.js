import express from 'express';
var app = express();
import bcrypt from 'bcrypt';


import { connectDB, getDB } from './db.js';
connectDB();


const backRegisterHandle = app.post('/home/register', async (req,res)=>{
    const {name,email,contectNumber,address,password,registerTime} = req.body;
    try{
    const hashPassword = await bcrypt.hash(password, 10);
    res.send('User Register Successfully');
    const db = getDB();
    const collection = db.collection('volunteer');
    const result = await collection.insertOne({name,email,contectNumber,address,hashPassword,registerTime});
    console.log("Insertion result:", result);
    }catch(error){
        console.error("Error during registration:", error);
        res.status(500).send('An error occurred during registration');
    }
})


export default backRegisterHandle;
