import { connectDB, getDB } from './db.js';
connectDB();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import express from 'express';
var app = express();
app.use(express.json());


const backLoginHandle = app.use('/home/login', async (req, res) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        console.log("back",email, password);
        const db = getDB();
        const dbresult = await db.collection('volunteer').findOne({ email: email})
        console.log(dbresult);
        console.log("db",dbresult.email);

        console.log("db",dbresult.hashPassword);

        // password and email check
        if (dbresult.email === email && await bcrypt.compare(password, dbresult.hashPassword)){
          console.log("password match"+ password, dbresult.hashPassword);
          const token = jwt.sign({ email: email }, "secretkey", { expiresIn: '1h' });
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
        }else if(!dbresult.email && !dbresult.hashPassword){
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
    console.log("tokenVerify");

    const decoded = jwt.verify(tokenVerify, "secretkey");
    console.log("req.user",req.user);
    req.user = decoded;
    console.log("req.user2",req.user);
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
  console.log('logged out')
});

export { verifyToken, logoutHandle, backLoginHandle };
