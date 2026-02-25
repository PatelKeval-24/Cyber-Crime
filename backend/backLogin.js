import { connectDB, getDB } from './db.js';
connectDB();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import express from 'express';
var app = express();
app.use(express.json());

const adminLogin = async(db , email , password, res) =>{

const dbresult2 = await db.collection('admin').findOne({ email: email})
// console.log(dbresult2 , "admin")
  if (!dbresult2) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (dbresult2.email === email && dbresult2.password === password){ 
          const token = jwt.sign({ email: email,role:"admin",name : dbresult2.name }, "secretkey", { expiresIn: '1h' });
          res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 3600000 // 1 hour
          })
          res.status(200).json({ 
            success: true, 
            message: 'Login successful',
            token: token
          });
        }else if(!dbresult2.email && !dbresult2.password ){
          res.status(401).json({ 
            success: false, 
            message: 'Invalid email or password' });
        }
    }


const backLoginHandle = app.post('/home/login', async (req, res) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        // console.log("back",email, password);
        const db = getDB();
        // console.log(db ,"heee")
        const dbresult = await db.collection('volunteer').findOne({ email: email})
        // console.log(dbresult ,"admin-----")
        
        if (!dbresult) return adminLogin(db , email , password, res);
        

        // password and email check
        if (dbresult.email === email && await bcrypt.compare(password, dbresult.hashPassword) && dbresult.status === "approved"){
          const token = jwt.sign({ email: email,role:"volunteer",name : dbresult.name}, "secretkey", { expiresIn: '1h' });
          res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 3600000 // 1 hour
          })
          res.status(200).json({ 
            success: true, 
            message: 'Login successful',
            token: token
          });
        }else if(!dbresult.email && !dbresult.hashPassword || dbresult.password === password){
          res.status(401).json({ 
            success: false, 
            message: 'Invalid email or password' });
        }
    }

})

const verifyTokenFunction =  async (req, res, next) => {
  // console.log("verifyToken",req.body.token);
  const tokenVerify = req.body.token;

  if (!tokenVerify) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
//  console.log("tokenVerify",tokenVerify);
  try {
    // console.log("tokenVerify");

    const decoded = jwt.verify(tokenVerify, "secretkey");

    req.user = decoded;
    // console.log("req.user2",req.user);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token----' });
  }
};

const verifyToken = app.use('/home/verify-token', verifyTokenFunction, (req, res) => {
  res.json({ success: true, message: 'Access granted to protected route', user: req.user });
});

const logoutHandle = app.use('/home/logout', (req, res) => {
  res.clearCookie('token').json({ success: true, message: 'Logout successful' }); 
  // console.log('logged out')
});

export { verifyToken, logoutHandle, backLoginHandle };
