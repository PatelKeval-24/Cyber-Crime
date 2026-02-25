import express from 'express';
var app = express();
import bcrypt from 'bcrypt';


import { getDB } from './db.js';



const backRegisterHandle = app.use('/home/register', async (req,res)=>{
    const {name,email,contectNumber, role = "volunteer",status = "pending",address,password,registerTime} = req.body;
    try{
    const hashPassword = await bcrypt.hash(password, 10);
    
    const db = getDB();
    const collection = db.collection('volunteer');
    const result = await collection.insertOne({name,email,contectNumber,role,status,address,hashPassword,registerTime});
    res.send('User Register Successfully');
    // console.log("Insertion result:", result);
    }catch(error){
        console.error("Error during registration:", error);
        res.status(500).send('An error occurred during registration');
    }
})


export default backRegisterHandle;
