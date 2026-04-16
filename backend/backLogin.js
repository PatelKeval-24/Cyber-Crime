import { getDB } from './db.js';
import { getAuditData } from './auditLog.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import express from 'express';
import e from 'express';
 
var app = express();
app.use(express.json());

const adminLogin = async( db , email , password, res,req) =>{

const dbresult2 = await db.collection('admin').findOne({ email: email})
// console.log(dbresult2 , "admin")
  if (!dbresult2) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  console.log(dbresult2.email,dbresult2.password,dbresult2 , "admin")
  console.log(email,password)
  if (dbresult2.email === email && dbresult2.password === password){ 
    // console.log(dbresult2 , "admin ---")
          const token = jwt.sign({ email: email,role:"admin",name : dbresult2.name },process.env.JWTKEY, { expiresIn: '1h' });
          res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 3600000*24 // 1 day
          })
          res.status(200).json({ 
            success: true, 
            message: 'Login successful',
            token:token
          });
          // Audit Log for login
          const action = "User Login";
          getAuditData(req, action, email);
        }// If it reaches here, it's a failure. No need for complex "else if"
return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

const backLoginHandle =  async (req, res) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        console.log("back",email, password);
        const db = getDB();
        // console.log(db ,"heee")
        const dbresult = await db.collection('volunteer').findOne({ email: email})
        // console.log(dbresult ,"admin-----")
        
        if (!dbresult) return adminLogin(db , email , password, res ,req);
        

        // password and email check
        if (dbresult.email === email && await bcrypt.compare(password, dbresult.hashPassword) && dbresult.status === "approved"){
          const token = jwt.sign({ email: email ,role:"volunteer",name : dbresult.name}, "secretkey", { expiresIn: '1h' });
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
          // Audit Log for login
          const action = "User Login";
          getAuditData(req, action,email);

        }
        // If it reaches here, it's a failure. No need for complex "else if"
return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

}

const verifyTokenFunction =  async (req, res, next) => {
  // console.log("verifyToken",req);
  // console.log("verifyToken",req.cookies.token);
  const tokenVerify = req.cookies.token;
  // console.log(tokenVerify,'empty or not ');
  
  if (!tokenVerify) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
//  console.log("tokenVerify",tokenVerify);
  try {
    // console.log("tokenVerify");

    const decoded = jwt.verify(tokenVerify, process.env.JWTKEY ||"secretkey");

    req.user = decoded;
    // console.log("req.user2",req.user);
    res.json({ success: true, message: 'Access granted to protected route', user: req.user });
    // next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token----' });
  }
};

const verifyToken = app.get("/home/verify-token", verifyTokenFunction, (req, res) => {
  // console.log(req.user,'in token verification')
  res.json({ success: true, message: 'Access granted to protected route', user: req.user });
});
 
const logoutHandle =  (req, res) => {
  res.clearCookie('token').json({ success: true, message: 'Logout successful' }); 
  // console.log('logged out')
};


// // --- Helper: Setup Email Transporter ---
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'kp562010@gmail.com', 
//     pass: 'Keval@2005' // Use Gmail App Password
//   }
// }); 

 
export { verifyToken, logoutHandle, backLoginHandle };
